import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { collection, doc, writeBatch } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { chunkArray, buildXlsxRows, CHUNK_SIZE } from './guestImportValidation'

export * from './guestImportValidation'

/** Parse a CSV File into { fields, rows } (rows = raw string-valued objects from papaparse). */
export function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve({ fields: results.meta.fields ?? [], rows: results.data }),
      error: reject,
    })
  })
}

/**
 * Write valid rows to the `guests` collection in sequential batches of CHUNK_SIZE.
 * Doc IDs are pre-generated client-side so each row's Firestore ID is known before commit,
 * preserving the CSV row -> document ID mapping even when a batch fails.
 * onProgress({ done, total }) fires after each chunk.
 */
export async function importGuestsInBatches(validItems, { onProgress } = {}) {
  const guestsRef = collection(db, 'guests')
  const imported = []
  const failed = []

  for (const chunk of chunkArray(validItems, CHUNK_SIZE)) {
    const batch = writeBatch(db)
    const refs = chunk.map(() => doc(guestsRef))
    chunk.forEach((item, i) => batch.set(refs[i], item.record))

    try {
      await batch.commit()
      chunk.forEach((item, i) => imported.push({ ...item, id: refs[i].id }))
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'Firestore write failed'
      chunk.forEach((item) => failed.push({ rowNumber: item.rowNumber, reason }))
    }

    onProgress?.({ done: imported.length + failed.length, total: validItems.length })
  }

  return { imported, failed }
}

/** Build the XLSX workbook and trigger a browser download. */
export function downloadImportXlsx(importedItems, baseUrl) {
  const rows = buildXlsxRows(importedItems, baseUrl)
  const sheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Guests')
  const timestamp = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(workbook, `guests-import-${timestamp}.xlsx`)
}
