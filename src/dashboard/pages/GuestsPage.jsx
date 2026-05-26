import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useGuestList } from '../hooks/useGuestList'
import { GUESTS_PAGE_SIZE } from '../services/guests'

const DEBOUNCE_MS = 300

function GuestDetailModal({ guest, onClose }) {
  const fields = [
    { label: 'First Name', value: guest.first_name || '—' },
    { label: 'Last Name', value: guest.last_name || '—' },
    { label: 'Address', value: guest.address || '—' },
    { label: 'Present', value: guest.present ? 'Yes' : 'No' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-modal-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-sm rounded-xl border border-stone-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h3
            id="guest-modal-title"
            className="font-serif text-lg text-stone-900"
          >
            Guest Detail
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <dl className="divide-y divide-stone-100 px-6 py-2">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4 py-3">
              <dt className="font-serif text-xs uppercase tracking-[0.12em] text-stone-500">{label}</dt>
              <dd className="text-right text-sm text-stone-800 break-words max-w-[60%]">{value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </motion.div>
  )
}

function GuestsPage() {
  const {
    searchInput,
    setSearchInput,
    guests,
    loading,
    error,
    pageIndex,
    hasNext,
    goNext,
    goPrev,
    togglePresent,
    updatingIds,
    isDebouncing,
  } = useGuestList()

  const [selectedGuest, setSelectedGuest] = useState(null)

  const isBusy = loading || isDebouncing
  const pageNumber = pageIndex + 1

  return (
    <div>
      <header className="border-b border-stone-300 pb-6">
        <h2 className="font-serif text-3xl text-stone-900">Guest</h2>
        <p className="mt-2 text-stone-600">
          Search and manage guests.
        </p>
      </header>

      <div className="mt-6">
        <label
          htmlFor="guest-search"
          className="block font-serif text-xs uppercase tracking-[0.15em] text-stone-600"
        >
          Search guests
        </label>
        <input
          id="guest-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by name or address…"
          className="mt-2 w-full max-w-md rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
        />
      </div>

      {error ? (
        <p
          className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 font-serif text-xs uppercase tracking-[0.12em] text-stone-600">
            <tr>
              <th className="px-4 py-3">First Name</th>
              <th className="px-4 py-3">Last Name</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3 text-center">Present</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100" aria-busy={isBusy}>
            {isBusy ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-stone-500">
                  Loading guests…
                </td>
              </tr>
            ) : guests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-stone-500">
                  No guests found.
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr key={guest.id} className="text-stone-800">
                  <td className="max-w-[10rem] truncate px-4 py-3" title={guest.first_name}>{guest.first_name}</td>
                  <td className="max-w-[10rem] truncate px-4 py-3" title={guest.last_name}>{guest.last_name}</td>
                  <td className="max-w-[16rem] truncate px-4 py-3" title={guest.address || '—'}>{guest.address || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={guest.present}
                      disabled={updatingIds.has(guest.id)}
                      aria-label={`Mark ${guest.first_name} ${guest.last_name} as present`}
                      onChange={(event) =>
                        togglePresent(guest.id, event.target.checked)
                      }
                      className="h-4 w-4 rounded border-stone-300 text-stone-800 focus:ring-stone-400 disabled:opacity-50"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedGuest(guest)}
                      className="rounded border border-stone-300 bg-white px-2.5 py-1 font-serif text-xs uppercase tracking-[0.12em] text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-600">
          Page {pageNumber} · {GUESTS_PAGE_SIZE} guests per page
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={pageIndex === 0 || isBusy}
            className="rounded-md border border-stone-300 bg-white px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!hasNext || isBusy}
            className="rounded-md border border-stone-300 bg-white px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedGuest && (
          <GuestDetailModal guest={selectedGuest} onClose={() => setSelectedGuest(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default GuestsPage
