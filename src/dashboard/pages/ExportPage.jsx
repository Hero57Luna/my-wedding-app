import { useState } from 'react'
import { fetchAllGuestsForExport } from '../services/guests'
import { downloadExportXlsx } from '../services/guestImport'

const BASE_WEDDING_URL = import.meta.env.VITE_BASE_WEDDING_URL

function ExportPage() {
  const [status, setStatus] = useState('idle') // idle -> exporting -> done
  const [error, setError] = useState(null)
  const [count, setCount] = useState(0)

  async function handleExport() {
    setStatus('exporting')
    setError(null)
    try {
      const items = await fetchAllGuestsForExport()
      downloadExportXlsx(items, BASE_WEDDING_URL ?? '')
      setCount(items.length)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export guests')
      setStatus('idle')
    }
  }

  return (
    <div>
      <header className="border-b border-stone-300 pb-6">
        <h2 className="font-serif text-3xl text-stone-900">Export Guests</h2>
        <p className="mt-2 text-stone-600">
          Download every guest as XLSX, in the same format as an import download, plus each row's document ID.
        </p>
      </header>

      {!BASE_WEDDING_URL ? (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          VITE_BASE_WEDDING_URL is not set — the URL column will be empty.
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleExport}
        disabled={status === 'exporting'}
        className="mt-6 rounded-md bg-stone-800 px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-white transition hover:bg-stone-700 disabled:opacity-50"
      >
        {status === 'exporting' ? 'Exporting…' : 'Export all guests'}
      </button>

      {status === 'done' ? (
        <p className="mt-4 text-sm text-stone-600">
          Exported <span className="font-semibold text-green-700">{count}</span> guest{count === 1 ? '' : 's'}.
        </p>
      ) : null}
    </div>
  )
}

export default ExportPage
