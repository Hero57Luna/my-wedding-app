import { useEffect, useState } from 'react'
import { subscribeGuestSummary } from '../services/guestSummary'

export function useGuestSummary() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = subscribeGuestSummary(
      (data) => {
        setSummary(data)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  return { summary, loading, error }
}
