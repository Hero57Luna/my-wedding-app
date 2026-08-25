import assert from 'node:assert/strict'

// Mirror of matchesAllTokens in guests.js (module imports firebase, so kept standalone).
function matchesAllTokens(data, tokens) {
  const haystack = (
    data.search_name ?? `${data.name ?? ''} ${data.address ?? ''}`
  ).toLowerCase()
  return tokens.every((token) => haystack.includes(token))
}

const setyo = { search_name: 'setyo (pakde nanang) malang' }
const ipul = { search_name: 'pakde ipul surabaya' }
const bagoes = { search_name: 'bagoes (om gaguk) kediri' }
const noSearchName = { name: 'Setyo (Pakde Nanang)', address: 'Malang' }

assert.ok(matchesAllTokens(setyo, ['pakde']), 'matches inside parentheses')
assert.ok(matchesAllTokens(ipul, ['pakde']))
assert.ok(!matchesAllTokens(bagoes, ['pakde']))
assert.ok(matchesAllTokens(setyo, ['pakde', 'nanang']), 'all tokens must match')
assert.ok(!matchesAllTokens(setyo, ['pakde', 'ipul']))
assert.ok(matchesAllTokens(noSearchName, ['pakde']), 'falls back to name + address')

console.log('guest search ok')
