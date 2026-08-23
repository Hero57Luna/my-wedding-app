import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { useSearchParams } from 'react-router-dom'
import { db } from '../firebase/config'
import InvitationApp from './InvitationApp'
import LocaleProvider from './i18n/LocaleProvider'
import NotFoundPage from './NotFoundPage'

/** Guards the invitation behind a `?ref=<guestId>` that must exist in the `guests` collection. */
function InvitationGate() {
  const [searchParams] = useSearchParams()
  const ref = searchParams.get('ref')
  // undefined = loading, null = not found, object = guest data
  const [guest, setGuest] = useState(ref ? undefined : null)

  useEffect(() => {
    if (!ref) return
    let cancelled = false
    getDoc(doc(db, 'guests', ref))
      .then((snap) => !cancelled && setGuest(snap.exists() ? { id: snap.id, ...snap.data() } : null))
      .catch(() => !cancelled && setGuest(null))
    return () => {
      cancelled = true
    }
  }, [ref])

  if (guest === undefined) return null
  if (guest === null) return <NotFoundPage />

  return (
    <LocaleProvider>
      <InvitationApp guest={guest} />
    </LocaleProvider>
  )
}

export default InvitationGate
