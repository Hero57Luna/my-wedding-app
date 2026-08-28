import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import {
  parseSheetFile,
  buildGuestUpdates,
  updateGuestsInBatches,
  UPDATABLE_COLUMNS,
} from '../services/guestImport'

// idle -> ready (parsed, awaiting confirm) -> updating -> done
function BulkUpdatePage() {
  const fileInputRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [fileName, setFileName] = useState('')
  const [parseError, setParseError] = useState(null)
  const [pending, setPending] = useState(null) // { updates, skipped }
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [result, setResult] = useState(null) // { updated, failed }

  function reset() {
    setStatus('idle')
    setFileName('')
    setParseError(null)
    setPending(null)
    setProgress({ done: 0, total: 0 })
    setResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setParseError(null)
    setResult(null)

    try {
      const { fields, rows } = await parseSheetFile(file)
      if (!fields.includes('documentID')) {
        setParseError('Missing the documentID column — use a file downloaded from the Export page.')
        setStatus('idle')
        return
      }
      setPending(buildGuestUpdates(rows))
      setStatus('ready')
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Failed to read file')
      setStatus('idle')
    }
  }

  async function handleUpdate() {
    if (!pending) return
    setStatus('updating')
    setProgress({ done: 0, total: pending.updates.length })

    const { updated, failed } = await updateGuestsInBatches(pending.updates, {
      onProgress: setProgress,
    })

    setResult({ updated, failed })
    setStatus('done')
  }

  const inputClass =
    'mt-1.5 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-stone-800 file:px-3 file:py-1.5 file:font-serif file:text-xs file:uppercase file:tracking-[0.12em] file:text-white'

  return (
    <div>
      <header className="border-b border-stone-300 pb-6">
        <h2 className="font-serif text-3xl text-stone-900">Bulk Update</h2>
        <p className="mt-2 text-stone-600">
          Export all guests, fill in the {UPDATABLE_COLUMNS.join(' / ')} columns in Excel, then upload the
          file back here. Rows are matched by documentID; blank cells are left untouched.
        </p>
      </header>

      <div className="mt-6 max-w-lg">
        <label htmlFor="update-file" className="block font-serif text-xs uppercase tracking-[0.12em] text-stone-600">
          Edited export file (XLSX or CSV)
        </label>
        <input
          id="update-file"
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv,text/csv"
          onChange={handleFileChange}
          disabled={status === 'updating'}
          className={inputClass}
        />
      </div>

      {parseError ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {parseError}
        </p>
      ) : null}

      {status === 'ready' && pending ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 max-w-lg rounded-xl border border-stone-200 bg-white p-5"
        >
          <p className="text-sm text-stone-800">
            <span className="font-semibold">{fileName}</span> — {pending.updates.length} guest
            {pending.updates.length === 1 ? '' : 's'} will be updated
            {pending.skipped.length > 0 ? `, ${pending.skipped.length} row(s) skipped` : ''}.
          </p>
          {pending.skipped.length > 0 ? (
            <ul className="mt-2 max-h-32 space-y-0.5 overflow-y-auto text-xs text-stone-500">
              {pending.skipped.map((row) => (
                <li key={row.rowNumber}>Row {row.rowNumber}: {row.reason}</li>
              ))}
            </ul>
          ) : null}
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={pending.updates.length === 0}
              className="rounded-md bg-stone-800 px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-white transition hover:bg-stone-700 disabled:opacity-50"
            >
              Update {pending.updates.length} guest{pending.updates.length === 1 ? '' : 's'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-md border border-stone-300 bg-white px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-stone-700 transition hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      ) : null}

      {status === 'updating' ? (
        <div className="mt-6 max-w-lg">
          <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-stone-800 transition-all"
              style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-stone-600">
            Updating… {progress.done} / {progress.total}
          </p>
        </div>
      ) : null}

      {status === 'done' && result ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 max-w-lg rounded-xl border border-stone-200 bg-white p-5"
        >
          <p className="text-sm text-stone-800">
            Updated <span className="font-semibold text-green-700">{result.updated.length}</span> guest
            {result.updated.length === 1 ? '' : 's'}
            {result.failed.length > 0 ? (
              <>, <span className="font-semibold text-red-700">{result.failed.length}</span> failed</>
            ) : null}
            .
          </p>
          {result.failed.length > 0 ? (
            <ul className="mt-3 max-h-40 space-y-0.5 overflow-y-auto text-xs text-stone-500">
              {result.failed.map((row) => (
                <li key={row.rowNumber}>Row {row.rowNumber}: {row.reason}</li>
              ))}
            </ul>
          ) : null}
          <button
            type="button"
            onClick={reset}
            className="mt-4 block rounded-md bg-stone-800 px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-white transition hover:bg-stone-700"
          >
            Update another file
          </button>
        </motion.div>
      ) : null}
    </div>
  )
}

export default BulkUpdatePage
