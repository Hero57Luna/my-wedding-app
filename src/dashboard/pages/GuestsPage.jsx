import { useGuestList } from '../hooks/useGuestList'
import { GUESTS_PAGE_SIZE } from '../services/guests'

const DEBOUNCE_MS = 300

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
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100" aria-busy={isBusy}>
            {isBusy ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-stone-500">
                  Loading guests…
                </td>
              </tr>
            ) : guests.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-stone-500">
                  No guests found.
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr key={guest.id} className="text-stone-800">
                  <td className="px-4 py-3">{guest.first_name}</td>
                  <td className="px-4 py-3">{guest.last_name}</td>
                  <td className="px-4 py-3">{guest.address || '—'}</td>
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
    </div>
  )
}

export default GuestsPage
