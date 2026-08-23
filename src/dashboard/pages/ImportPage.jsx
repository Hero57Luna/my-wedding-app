import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import {
  parseCsvFile,
  validateHeaders,
  validateRows,
  importGuestsInBatches,
  downloadImportXlsx,
} from '../services/guestImport'

const BASE_WEDDING_URL = import.meta.env.VITE_BASE_WEDDING_URL

// idle -> ready (parsed, awaiting confirm) -> importing -> done
function ImportPage() {
  const fileInputRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [fileName, setFileName] = useState('')
  const [parseError, setParseError] = useState(null)
  const [pending, setPending] = useState(null) // { valid, invalid }
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [result, setResult] = useState(null) // { imported, failed }

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
      const { fields, rows } = await parseCsvFile(file)
      const missing = validateHeaders(fields)
      if (missing.length > 0) {
        setParseError(`Missing required column(s): ${missing.join(', ')}`)
        setStatus('idle')
        return
      }
      const { valid, invalid } = validateRows(rows)
      setPending({ valid, invalid })
      setStatus('ready')
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Failed to read CSV file')
      setStatus('idle')
    }
  }

  async function handleImport() {
    if (!pending) return
    setStatus('importing')
    setProgress({ done: 0, total: pending.valid.length })

    const { imported, failed } = await importGuestsInBatches(pending.valid, {
      onProgress: setProgress,
    })

    setResult({ imported, failed: [...pending.invalid, ...failed] })
    setStatus('done')

    if (imported.length > 0 && BASE_WEDDING_URL) {
      downloadImportXlsx(imported, BASE_WEDDING_URL)
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-stone-800 file:px-3 file:py-1.5 file:font-serif file:text-xs file:uppercase file:tracking-[0.12em] file:text-white'

  return (
    <div>
      <header className="border-b border-stone-300 pb-6">
        <h2 className="font-serif text-3xl text-stone-900">Import Guests</h2>
        <p className="mt-2 text-stone-600">
          Upload a CSV with columns: name, address, vip, time, search_name, gender, present.
        </p>
      </header>

      {!BASE_WEDDING_URL ? (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          VITE_BASE_WEDDING_URL is not set — the invitation links XLSX will be skipped after import.
        </p>
      ) : null}

      <div className="mt-6 max-w-lg">
        <label htmlFor="csv-file" className="block font-serif text-xs uppercase tracking-[0.12em] text-stone-600">
          CSV file
        </label>
        <input
          id="csv-file"
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          disabled={status === 'importing'}
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
            <span className="font-semibold">{fileName}</span> — {pending.valid.length} valid row
            {pending.valid.length === 1 ? '' : 's'} ready to import
            {pending.invalid.length > 0 ? `, ${pending.invalid.length} invalid row(s) will be skipped` : ''}.
          </p>
          {pending.invalid.length > 0 ? (
            <ul className="mt-2 max-h-32 space-y-0.5 overflow-y-auto text-xs text-stone-500">
              {pending.invalid.map((row) => (
                <li key={row.rowNumber}>Row {row.rowNumber}: {row.reason}</li>
              ))}
            </ul>
          ) : null}
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleImport}
              disabled={pending.valid.length === 0}
              className="rounded-md bg-stone-800 px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-white transition hover:bg-stone-700 disabled:opacity-50"
            >
              Import {pending.valid.length} guest{pending.valid.length === 1 ? '' : 's'}
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

      {status === 'importing' ? (
        <div className="mt-6 max-w-lg">
          <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-stone-800 transition-all"
              style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-stone-600">
            Importing… {progress.done} / {progress.total}
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
            Imported <span className="font-semibold text-green-700">{result.imported.length}</span> guest
            {result.imported.length === 1 ? '' : 's'}
            {result.failed.length > 0 ? (
              <>, <span className="font-semibold text-red-700">{result.failed.length}</span> failed</>
            ) : null}
            .
          </p>
          {result.imported.length > 0 && BASE_WEDDING_URL ? (
            <button
              type="button"
              onClick={() => downloadImportXlsx(result.imported, BASE_WEDDING_URL)}
              className="mt-3 rounded-md border border-stone-300 bg-white px-3 py-1.5 font-serif text-xs uppercase tracking-[0.12em] text-stone-700 transition hover:bg-stone-50"
            >
              Download XLSX again
            </button>
          ) : null}
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
            Import another file
          </button>
        </motion.div>
      ) : null}
    </div>
  )
}

export default ImportPage
