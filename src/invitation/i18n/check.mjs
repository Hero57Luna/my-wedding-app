// Run with: npm run check:i18n
// Guards three things across the invitation:
//   1. en.json and id.json never drift apart
//   2. every message parses as ICU (a stray apostrophe before a { placeholder
//      is the usual culprit — ICU treats it as an escape character)
//   3. every message id referenced in the JSX actually exists
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from '@formatjs/icu-messageformat-parser'

const i18nDir = new URL('.', import.meta.url)
const load = (name) => JSON.parse(readFileSync(new URL(`${name}.json`, i18nDir), 'utf8'))

const en = load('en')
const id = load('id')

const missing = Object.keys(en).filter((key) => !(key in id))
const extra = Object.keys(id).filter((key) => !(key in en))
assert.deepEqual(missing, [], `missing in id.json: ${missing.join(', ')}`)
assert.deepEqual(extra, [], `not in en.json: ${extra.join(', ')}`)

for (const [locale, messages] of [['en', en], ['id', id]]) {
  for (const [key, message] of Object.entries(messages)) {
    assert.ok(message.trim(), `${locale}.json ${key}: empty message`)
    assert.doesNotThrow(() => parse(message), `${locale}.json ${key}: bad ICU syntax`)
  }
}

function jsxFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return jsxFiles(path)
    return entry.name.endsWith('.jsx') ? [path] : []
  })
}

const ID_PATTERN = /['"]([a-z][a-zA-Z]*\.[a-zA-Z][a-zA-Z0-9]*)['"]/g
const used = new Set()
for (const file of jsxFiles(new URL('..', i18nDir).pathname)) {
  for (const [, key] of readFileSync(file, 'utf8').matchAll(ID_PATTERN)) used.add(key)
}

const unknown = [...used].filter((key) => !(key in en))
assert.deepEqual(unknown, [], `used in JSX but not in en.json: ${unknown.join(', ')}`)

const unused = Object.keys(en).filter((key) => !used.has(key))
if (unused.length) console.warn(`warning — unused keys: ${unused.join(', ')}`)

console.log(`i18n ok — ${Object.keys(en).length} keys, ${used.size} referenced in JSX`)
