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
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../../firebase/config'

export const GUESTS_PAGE_SIZE = 50
const SEARCH_FETCH_MAX = 100

const guestsRef = collection(db, 'guests')

export function mapGuestDoc(docSnap) {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    first_name: data.first_name ?? '',
    last_name: data.last_name ?? '',
    address: data.address ?? '',
    gender: data.gender ?? 'male',
    present: data.present === true,
    vip: data.vip === true,
  }
}

function tokenizeSearch(search) {
  return search.trim().split(/\s+/).filter(Boolean)
}

function matchesAllTokens(data, tokens) {
  const haystack = (data.search_name ?? '').toLowerCase()
  return tokens.every((token) => haystack.includes(token.toLowerCase()))
}

function prefixQuery(field, term, pageSize, cursor) {
  const end = `${term}\uf8ff`
  if (cursor) {
    return query(
      guestsRef,
      where(field, '>=', term),
      where(field, '<=', end),
      orderBy(field),
      startAfter(cursor),
      limit(pageSize),
    )
  }
  return query(
    guestsRef,
    where(field, '>=', term),
    where(field, '<=', end),
    orderBy(field),
    limit(pageSize),
  )
}

async function queryByPrefix(field, term, max) {
  if (!term) return []
  const snapshot = await getDocs(prefixQuery(field, term, max))
  return snapshot.docs
}

function mergeGuestDocs(...docGroups) {
  const byId = new Map()
  for (const docs of docGroups) {
    for (const docSnap of docs) {
      byId.set(docSnap.id, docSnap)
    }
  }
  return [...byId.values()].sort((a, b) => {
    const ad = a.data()
    const bd = b.data()
    return (
      (ad.first_name ?? '').localeCompare(bd.first_name ?? '') ||
      (ad.last_name ?? '').localeCompare(bd.last_name ?? '') ||
      (ad.address ?? '').localeCompare(bd.address ?? '')
    )
  })
}

async function fetchAllGuestsBrief(max) {
  const snapshot = await getDocs(
    query(
      guestsRef,
      orderBy('first_name'),
      orderBy('last_name'),
      orderBy('address'),
      limit(max),
    ),
  )
  return snapshot.docs
}

function filterByTokens(docs, tokens) {
  return docs.filter((docSnap) => matchesAllTokens(docSnap.data(), tokens))
}

/** Token search: every word must appear somewhere in search_name (first_name + last_name + address). */
export async function fetchSearchGuests(search, max = SEARCH_FETCH_MAX) {
  const tokens = tokenizeSearch(search)
  if (tokens.length === 0) return []

  const termLower = search.trim().toLowerCase()

  const prefixDocs = await Promise.all([
    queryByPrefix('search_name', termLower, max),
    ...tokens.map((token) =>
      queryByPrefix('search_name', token.toLowerCase(), max),
    ),
  ])

  const merged = mergeGuestDocs(...prefixDocs, await fetchAllGuestsBrief(max))
  return filterByTokens(merged, tokens).map(mapGuestDoc)
}

async function fetchBrowsePage({ cursor, pageSize }) {
  const constraints = [
    orderBy('first_name'),
    orderBy('last_name'),
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
    orderBy('first_name'),
    orderBy('last_name'),
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
  await updateDoc(doc(db, 'guests', guestId), { present })
}

function capitalizeWords(str) {
  return str
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function updateGuest(guestId, { first_name, last_name, address, gender, present, vip }) {
  const cappedFirst = capitalizeWords(first_name)
  const cappedLast = capitalizeWords(last_name)
  const cappedAddress = capitalizeWords(address)
  const search_name = `${cappedFirst} ${cappedLast} ${cappedAddress}`
    .trim()
    .toLowerCase()

  await updateDoc(doc(db, 'guests', guestId), {
    first_name: cappedFirst,
    last_name: cappedLast,
    address: cappedAddress,
    gender,
    present,
    vip,
    search_name,
  })
}

export async function deleteGuest(guestId) {
  await deleteDoc(doc(db, 'guests', guestId))
}

export async function addGuest({ first_name, last_name, address, gender, present, vip = false }) {
  const cappedFirst = capitalizeWords(first_name)
  const cappedLast = capitalizeWords(last_name)
  const cappedAddress = capitalizeWords(address)
  const search_name = `${cappedFirst} ${cappedLast} ${cappedAddress}`
    .trim()
    .toLowerCase()

  await addDoc(guestsRef, {
    first_name: cappedFirst,
    last_name: cappedLast,
    address: cappedAddress,
    gender,
    present,
    vip,
    search_name,
  })
}
