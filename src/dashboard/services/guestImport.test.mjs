// Plain-assert self-check for the pure parsing/validation logic in guestImportValidation.js.
// Run with: node src/dashboard/services/guestImport.test.mjs
import assert from 'node:assert/strict'
import {
  toBoolean,
  validateHeaders,
  validateRow,
  validateRows,
  chunkArray,
  buildXlsxRows,
  buildExportXlsxRows,
} from './guestImportValidation.js'

// toBoolean: accepts 0/1, true/false, yes/no, case-insensitive; rejects junk
assert.equal(toBoolean('1'), true)
assert.equal(toBoolean('0'), false)
assert.equal(toBoolean('TRUE'), true)
assert.equal(toBoolean('no'), false)
assert.equal(toBoolean(' Yes '), true)
assert.equal(toBoolean('maybe'), undefined)
assert.equal(toBoolean(''), undefined)

// validateHeaders: flags missing required columns
assert.deepEqual(validateHeaders(['name', 'address', 'vip', 'time', 'search_name', 'gender', 'present']), [])
assert.deepEqual(validateHeaders(['name', 'address']), ['vip', 'time', 'search_name', 'gender', 'present'])

// validateRow: happy path + failure reasons
const ok = validateRow({ name: 'Mas Tofan', address: 'Malang', vip: '0', time: '13:00', search_name: 'mas tofan malang', gender: 'male', present: '1' })
assert.equal(ok.ok, true)
assert.deepEqual(ok.record, { name: 'Mas Tofan', address: 'Malang', vip: false, time: '13:00', search_name: 'mas tofan malang', gender: 'male', present: true })

assert.equal(validateRow({ name: '', vip: '0', present: '0' }).ok, false)
assert.equal(validateRow({ name: 'X', vip: 'nope', present: '0' }).ok, false)
assert.equal(validateRow({ name: 'X', vip: '0', present: 'nope' }).ok, false)

// validateRows: splits valid/invalid, row numbers account for header row
const { valid, invalid } = validateRows([
  { name: 'Good', vip: '0', present: '1' },
  { name: '', vip: '0', present: '1' },
])
assert.equal(valid.length, 1)
assert.equal(invalid.length, 1)
assert.equal(valid[0].rowNumber, 2)
assert.equal(invalid[0].rowNumber, 3)

// chunkArray
assert.deepEqual(chunkArray([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]])
assert.deepEqual(chunkArray([], 50), [])

// buildXlsxRows: URL uses doc id, columns in spec order
const rows = buildXlsxRows(
  [{ record: { name: 'A', address: 'B', vip: true, time: 'T', search_name: 'a b', gender: 'male', present: false }, id: 'abc123' }],
  'https://example.com/wedding',
)
assert.deepEqual(rows[0], {
  name: 'A', address: 'B', vip: true, time: 'T', search_name: 'a b', gender: 'male', present: false,
  URL: 'https://example.com/wedding?ref=abc123',
})

// buildExportXlsxRows: documentID + session (record.time) + arrival, on top of buildXlsxRows' columns
const arrivalDate = new Date('2026-08-26T10:00:00Z')
const exportRows = buildExportXlsxRows(
  [{
    record: { name: 'A', address: 'B', vip: true, time: 'T', search_name: 'a b', gender: 'male', present: true },
    id: 'abc123',
    arrival: arrivalDate,
  }],
  'https://example.com/wedding',
)
assert.deepEqual(exportRows[0], {
  documentID: 'abc123',
  name: 'A', address: 'B', vip: true, session: 'T', arrival: arrivalDate.toLocaleString(),
  search_name: 'a b', gender: 'male', present: true,
  URL: 'https://example.com/wedding?ref=abc123',
})

// buildExportXlsxRows: no arrival yet (guest not checked in) -> blank column, not "null"
const notArrivedRow = buildExportXlsxRows(
  [{ record: { name: 'A', address: 'B', vip: false, time: 'T', search_name: 'a b', gender: 'male', present: false }, id: 'x', arrival: null }],
  'https://example.com/wedding',
)
assert.equal(notArrivedRow[0].arrival, '')

console.log('guestImport.test.mjs: all assertions passed')
