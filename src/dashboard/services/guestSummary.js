import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/config'

const guestsRef = collection(db, 'guests')

function toSummary(snapshot) {
  const totalGuests = snapshot.size
  const presentGuests = snapshot.docs.filter(
    (doc) => doc.data().present === true,
  ).length

  return {
    totalGuests,
    presentGuests,
    absentGuests: totalGuests - presentGuests,
  }
}

export function subscribeGuestSummary(onData, onError) {
  return onSnapshot(guestsRef, (snapshot) => onData(toSummary(snapshot)), onError)
}

export function attendanceRate(summary) {
  if (!summary?.totalGuests) return 0
  return Math.round((summary.presentGuests / summary.totalGuests) * 100)
}
