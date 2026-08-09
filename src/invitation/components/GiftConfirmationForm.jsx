import { useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { GIFT_ACCOUNTS } from '../assets'

const GIFT_TYPES = [
  { value: 'transfer-of-money', label: 'Transfer of Money' },
  { value: 'send-gift', label: 'Send a Gift' },
]

const TRANSFER_DESTINATIONS = [
  { value: 'tf-to-groom', label: `${GIFT_ACCOUNTS.groom.name} (Groom)` },
  { value: 'tf-to-bride', label: `${GIFT_ACCOUNTS.bride.name} (Bride)` },
]

function GiftConfirmationForm() {
  const [name, setName] = useState('')
  const [type, setType] = useState('transfer-of-money')
  const [destination, setDestination] = useState('tf-to-groom')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)

  const handleTypeChange = (value) => {
    setType(value)
    setDestination(value === 'send-gift' ? 'gift' : 'tf-to-groom')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!name.trim() || saving) return

    setSaving(true)
    setStatus(null)
    try {
      await addDoc(collection(db, 'wedding-gift'), {
        name: name.trim(),
        type,
        destination,
        createdAt: serverTimestamp(),
      })
      setStatus({ type: 'success', text: 'Thank you! Your confirmation has been received.' })
      setName('')
      setType('transfer-of-money')
      setDestination('tf-to-groom')
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-stone-300 bg-stone-50 p-5">
      <div>
        <h4 className="font-serif text-lg font-bold text-stone-900">Shipment Confirmation</h4>
        <p className="mt-1 text-xs italic leading-relaxed text-stone-500">
          Please confirm in the column below to facilitate data collection.
        </p>
      </div>

      {status && (
        <p
          role="alert"
          className={`rounded-md border px-3 py-2 text-sm ${
            status.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {status.text}
        </p>
      )}

      <div>
        <label
          htmlFor="gift-sender-name"
          className="block font-serif text-xs uppercase tracking-[0.15em] text-stone-600"
        >
          Name
        </label>
        <input
          id="gift-sender-name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={saving}
          placeholder="Sender Name"
          className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200 disabled:opacity-50"
        />
      </div>

      <div>
        <p className="font-serif text-xs uppercase tracking-[0.15em] text-stone-600">Gift Type</p>
        <div className="mt-2 space-y-2">
          {GIFT_TYPES.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-stone-800">
              <input
                type="radio"
                name="gift-type"
                value={option.value}
                checked={type === option.value}
                onChange={() => handleTypeChange(option.value)}
                disabled={saving}
                className="h-4 w-4 border-stone-400 text-stone-800 focus:ring-stone-400"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="font-serif text-xs uppercase tracking-[0.15em] text-stone-600">
          Shipment Destination
        </p>
        <div className="mt-2 space-y-2">
          {type === 'transfer-of-money' ? (
            TRANSFER_DESTINATIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-stone-800">
                <input
                  type="radio"
                  name="gift-destination"
                  value={option.value}
                  checked={destination === option.value}
                  onChange={() => setDestination(option.value)}
                  disabled={saving}
                  className="h-4 w-4 border-stone-400 text-stone-800 focus:ring-stone-400"
                />
                {option.label}
              </label>
            ))
          ) : (
            <p className="text-sm text-stone-800">Gift &mdash; shipped to the address above</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-md bg-stone-900 px-4 py-3 font-serif text-xs uppercase tracking-[0.2em] text-white transition hover:bg-stone-700 disabled:opacity-50"
      >
        {saving ? 'Confirming…' : 'Confirmation'}
      </button>
    </form>
  )
}

export default GiftConfirmationForm
