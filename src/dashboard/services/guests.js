import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../../firebase/config'

export const GUESTS_PAGE_SIZE = 10
const SEARCH_FETCH_MAX = 100

const guestsRef = collection(db, 'guests')
const SEARCH_FIELDS = ['search_name', 'first_name', 'last_name', 'address']

export function mapGuestDoc(docSnap) {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    first_name: data.first_name ?? '',
    last_name: data.last_name ?? '',
    address: data.address ?? '',
    present: data.present === true,
  }
}

function tokenizeSearch(search) {
  return search.trim().split(/\s+/).filter(Boolean)
}

function guestDocHaystack(data) {
  return SEARCH_FIELDS.map((field) => data[field] ?? '')
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function matchesAllTokens(data, tokens) {
  const haystack = guestDocHaystack(data)
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

async function queryFieldPrefixes(field, trimmed, termLower, max) {
  const terms = new Set([termLower])
  if (trimmed !== termLower) terms.add(trimmed)
  const titled =
    termLower.length > 0
      ? termLower.charAt(0).toUpperCase() + termLower.slice(1)
      : termLower
  if (titled !== termLower) terms.add(titled)

  const groups = await Promise.all(
    [...terms].map((term) => queryByPrefix(field, term, max)),
  )
  return groups.flat()
}

function mergeGuestDocs(...docGroups) {
  const byId = new Map()
  for (const docs of docGroups) {
    for (const docSnap of docs) {
      byId.set(docSnap.id, docSnap)
    }
  }
  return [...byId.values()].sort((a, b) =>
    (a.data().search_name ?? a.data().last_name ?? '').localeCompare(
      b.data().search_name ?? b.data().last_name ?? '',
    ),
  )
}

async function fetchPrefixCandidatesForTerm(term, max) {
  const trimmed = term.trim()
  const termLower = trimmed.toLowerCase()

  const groups = await Promise.all([
    queryByPrefix('search_name', termLower, max),
    ...SEARCH_FIELDS.filter((f) => f !== 'search_name').map((field) =>
      queryFieldPrefixes(field, trimmed, termLower, max),
    ),
  ])

  return mergeGuestDocs(...groups)
}

async function fetchAllGuestsBrief(max) {
  const snapshot = await getDocs(
    query(guestsRef, orderBy('last_name'), orderBy('first_name'), limit(max)),
  )
  return snapshot.docs
}

function filterByTokens(docs, tokens) {
  return docs.filter((docSnap) => matchesAllTokens(docSnap.data(), tokens))
}

/** Token search: every word must appear somewhere in name/address fields. */
export async function fetchSearchGuests(search, max = SEARCH_FETCH_MAX) {
  const tokens = tokenizeSearch(search)
  if (tokens.length === 0) return []

  const trimmed = search.trim()
  const termLower = trimmed.toLowerCase()

  const prefixGroups = await Promise.all([
    ...tokens.map((token) => fetchPrefixCandidatesForTerm(token, max)),
    fetchPrefixCandidatesForTerm(trimmed, max),
    queryFieldPrefixes('last_name', trimmed, termLower, max),
    queryFieldPrefixes('address', trimmed, termLower, max),
    queryByPrefix('search_name', termLower, max),
  ])

  let merged = mergeGuestDocs(...prefixGroups)
  let filtered = filterByTokens(merged, tokens)

  if (filtered.length === 0 || tokens.length > 1) {
    merged = mergeGuestDocs(merged, await fetchAllGuestsBrief(max))
    filtered = filterByTokens(merged, tokens)
  }

  return filtered.map(mapGuestDoc)
}

async function fetchBrowsePage({ cursor, pageSize }) {
  const constraints = [orderBy('last_name'), orderBy('first_name')]
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

export async function setGuestPresent(guestId, present) {
  await updateDoc(doc(db, 'guests', guestId), { present })
}
