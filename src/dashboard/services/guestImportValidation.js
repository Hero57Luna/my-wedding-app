// Pure CSV row parsing/validation/shaping — no Firebase or browser APIs, so this is trivially
// unit-testable in plain Node (see guestImport.test.mjs) without a Vite/env setup.

export const REQUIRED_COLUMNS = ['name', 'address', 'vip', 'time', 'search_name', 'gender', 'present']
export const CHUNK_SIZE = 50

const BOOL_TRUE = new Set(['1', 'true', 'yes'])
const BOOL_FALSE = new Set(['0', 'false', 'no'])

/** Flexible boolean parse: 1/0, true/false, yes/no (case-insensitive). Returns undefined if unrecognized. */
export function toBoolean(raw) {
  const v = String(raw ?? '').trim().toLowerCase()
  if (BOOL_TRUE.has(v)) return true
  if (BOOL_FALSE.has(v)) return false
  return undefined
}

/** Missing required columns, if any (empty array = header is valid). */
export function validateHeaders(fields) {
  const present = new Set((fields ?? []).map((f) => f.trim()))
  return REQUIRED_COLUMNS.filter((col) => !present.has(col))
}

/** Validate + coerce a single CSV row. Returns { ok:true, record } or { ok:false, reason }. */
export function validateRow(row) {
  const name = String(row.name ?? '').trim()
  if (!name) return { ok: false, reason: 'name is required' }

  const vip = toBoolean(row.vip)
  if (vip === undefined) return { ok: false, reason: `invalid vip value "${row.vip ?? ''}"` }

  const present = toBoolean(row.present)
  if (present === undefined) return { ok: false, reason: `invalid present value "${row.present ?? ''}"` }

  return {
    ok: true,
    record: {
      name,
      address: String(row.address ?? '').trim(),
      vip,
      time: String(row.time ?? '').trim(),
      search_name: String(row.search_name ?? '').trim(),
      gender: String(row.gender ?? '').trim(),
      present,
    },
  }
}

/** Validate every parsed row. Returns { valid: [{rowNumber, record}], invalid: [{rowNumber, reason}] }. */
export function validateRows(rows) {
  const valid = []
  const invalid = []
  rows.forEach((row, i) => {
    const rowNumber = i + 2 // +1 for 1-index, +1 for header row
    const result = validateRow(row)
    if (result.ok) valid.push({ rowNumber, record: result.record })
    else invalid.push({ rowNumber, reason: result.reason })
  })
  return { valid, invalid }
}

export function chunkArray(arr, size) {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
  return chunks
}

/** Shape imported {record, id} items into flat XLSX row objects (column order matters for json_to_sheet). */
export function buildXlsxRows(importedItems, baseUrl) {
  return importedItems.map(({ record, id }) => ({
    name: record.name,
    address: record.address,
    vip: record.vip,
    time: record.time,
    search_name: record.search_name,
    gender: record.gender,
    present: record.present,
    URL: `${baseUrl}?ref=${id}`,
  }))
}
