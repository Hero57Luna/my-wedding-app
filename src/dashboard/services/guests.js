import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../firebase/config'

export const GUESTS_PAGE_SIZE = 50

const guestsRef = collection(db, 'guests')

export function mapGuestDoc(docSnap) {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    name: data.name ?? '',
    address: data.address ?? '',
    gender: data.gender ?? 'male',
    present: data.present === true,
    vip: data.vip === true,
    time: data.time ?? '',
    arrival: data.arrival?.toDate() ?? null,
  }
}

function tokenizeSearch(search) {
  return search.trim().split(/\s+/).filter(Boolean)
}

function matchesAllTokens(data, tokens) {
  const haystack = (
    data.search_name ?? `${data.name ?? ''} ${data.address ?? ''}`
  ).toLowerCase()
  return tokens.every((token) => haystack.includes(token))
}

/** Token search: every word must appear somewhere in search_name (name + address). */
export async function fetchSearchGuests(search) {
  const tokens = tokenizeSearch(search).map((t) => t.toLowerCase())
  if (tokens.length === 0) return []

  // Firestore can't do substring matching, so read the collection and filter here.
  // ponytail: full scan per search; add a token array + array-contains query if the guest list outgrows a few thousand.
  const snapshot = await getDocs(query(guestsRef, orderBy('name'), orderBy('address')))
  return snapshot.docs
    .filter((docSnap) => matchesAllTokens(docSnap.data(), tokens))
    .map(mapGuestDoc)
}

async function fetchBrowsePage({ cursor, pageSize }) {
  const constraints = [
    orderBy('name'),
    orderBy('address'),
  ]
  if (cursor) constraints.push(startAfter(cursor))
  constraints.push(limit(pageSize))

  const snapshot = await getDocs(query(guestsRef, ...constraints))
  const docs = snapshot.docs

  return {
    guests: docs.map(mapGuestDoc),
    lastDoc: docs.at(-1) ?? null,
    hasMore: docs.length === pageSize,
  }
}

export async function fetchGuestsPage({
  search = '',
  cursor = null,
  pageSize = GUESTS_PAGE_SIZE,
} = {}) {
  if (search.trim()) {
    throw new Error('Use fetchSearchGuests for search mode')
  }
  return fetchBrowsePage({ cursor, pageSize })
}

export function subscribeBrowsePage({ cursor, pageSize = GUESTS_PAGE_SIZE }, onData, onError) {
  const constraints = [
    orderBy('name'),
    orderBy('address'),
  ]
  if (cursor) constraints.push(startAfter(cursor))
  constraints.push(limit(pageSize))

  return onSnapshot(
    query(guestsRef, ...constraints),
    (snapshot) => {
      const docs = snapshot.docs
      onData({
        guests: docs.map(mapGuestDoc),
        lastDoc: docs.at(-1) ?? null,
        hasMore: docs.length === pageSize,
      })
    },
    onError,
  )
}

export async function setGuestPresent(guestId, present) {
  const payload = { present }
  if (present) payload.arrival = serverTimestamp()
  await updateDoc(doc(db, 'guests', guestId), payload)
}

function capitalizeWords(str) {
  return str
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function updateGuest(guestId, { name, address, gender, present, vip, time }) {
  const cappedName = capitalizeWords(name)
  const cappedAddress = capitalizeWords(address)
  const search_name = `${cappedName} ${cappedAddress}`.trim().toLowerCase()

  await updateDoc(doc(db, 'guests', guestId), {
    name: cappedName,
    address: cappedAddress,
    gender,
    present,
    vip,
    time,
    search_name,
  })
}

export async function deleteGuest(guestId) {
  await deleteDoc(doc(db, 'guests', guestId))
}

export async function addGuest({ name, address, gender, present, vip = false, time }) {
  const cappedName = capitalizeWords(name)
  const cappedAddress = capitalizeWords(address)
  const search_name = `${cappedName} ${cappedAddress}`.trim().toLowerCase()

  await addDoc(guestsRef, {
    name: cappedName,
    address: cappedAddress,
    gender,
    present,
    vip,
    time,
    search_name,
  })
}
