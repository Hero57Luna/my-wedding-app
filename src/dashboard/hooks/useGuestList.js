import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchGuestsPage,
  fetchSearchGuests,
  GUESTS_PAGE_SIZE,
  setGuestPresent,
} from '../services/guests'

const DEBOUNCE_MS = 300

export function useGuestList() {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [updatingIds, setUpdatingIds] = useState(() => new Set())
  const [refreshKey, setRefreshKey] = useState(0)
  const pageCursorsRef = useRef([])
  const searchResultsRef = useRef([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
      setPageIndex(0)
      pageCursorsRef.current = []
      searchResultsRef.current = []
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    let cancelled = false

    async function loadPage() {
      setLoading(true)
      setError(null)

      try {
        if (debouncedSearch) {
          if (pageIndex === 0 || searchResultsRef.current.length === 0) {
            searchResultsRef.current = await fetchSearchGuests(debouncedSearch)
          }

          if (cancelled) return

          const start = pageIndex * GUESTS_PAGE_SIZE
          const page = searchResultsRef.current.slice(
            start,
            start + GUESTS_PAGE_SIZE,
          )
          setGuests(page)
          setHasNext(start + GUESTS_PAGE_SIZE < searchResultsRef.current.length)
          return
        }

        const cursor =
          pageIndex === 0 ? null : pageCursorsRef.current[pageIndex - 1]
        const result = await fetchGuestsPage({ cursor })

        if (cancelled) return

        setGuests(result.guests)
        setHasNext(result.hasMore)
        pageCursorsRef.current[pageIndex] = result.lastDoc
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load guests')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadPage()
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, pageIndex, refreshKey])

  const isDebouncing = searchInput.trim() !== debouncedSearch

  const refresh = useCallback(() => {
    pageCursorsRef.current = []
    searchResultsRef.current = []
    setPageIndex(0)
    setRefreshKey((k) => k + 1)
  }, [])

  const goNext = useCallback(() => {
    if (hasNext) setPageIndex((page) => page + 1)
  }, [hasNext])

  const goPrev = useCallback(() => {
    setPageIndex((page) => (page > 0 ? page - 1 : page))
  }, [])

  const togglePresent = useCallback(async (guestId, present) => {
    setUpdatingIds((prev) => new Set(prev).add(guestId))
    setGuests((prev) =>
      prev.map((guest) =>
        guest.id === guestId ? { ...guest, present } : guest,
      ),
    )
    searchResultsRef.current = searchResultsRef.current.map((guest) =>
      guest.id === guestId ? { ...guest, present } : guest,
    )

    try {
      await setGuestPresent(guestId, present)
    } catch (err) {
      setGuests((prev) =>
        prev.map((guest) =>
          guest.id === guestId ? { ...guest, present: !present } : guest,
        ),
      )
      searchResultsRef.current = searchResultsRef.current.map((guest) =>
        guest.id === guestId ? { ...guest, present: !present } : guest,
      )
      setError(err instanceof Error ? err.message : 'Failed to update guest')
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev)
        next.delete(guestId)
        return next
      })
    }
  }, [])

  return {
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
    refresh,
  }
}
