import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { GIFT_ACCOUNTS } from '../assets'

const GIFT_TYPES = [
  { value: 'transfer-of-money', labelId: 'confirm.transfer' },
  { value: 'send-gift', labelId: 'confirm.sendGift' },
]

const TRANSFER_DESTINATIONS = [
  { value: 'tf-to-groom', labelId: 'confirm.toGroom', name: GIFT_ACCOUNTS.groom.name },
  { value: 'tf-to-bride', labelId: 'confirm.toBride', name: GIFT_ACCOUNTS.bride.name },
]

function GiftConfirmationForm() {
  const intl = useIntl()
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
      setStatus({ type: 'success', text: intl.formatMessage({ id: 'confirm.success' }) })
      setName('')
      setType('transfer-of-money')
      setDestination('tf-to-groom')
    } catch (err) {
      console.error(err)
      setStatus({ type: 'error', text: intl.formatMessage({ id: 'form.error' }) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-stone-300 bg-stone-50 p-5">
      <div>
        <h4 className="font-serif text-lg font-bold text-stone-900">
          <FormattedMessage id="confirm.title" />
        </h4>
        <p className="mt-1 text-xs italic leading-relaxed text-stone-500">
          <FormattedMessage id="confirm.subtitle" />
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
          <FormattedMessage id="common.name" />
        </label>
        <input
          id="gift-sender-name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={saving}
          placeholder={intl.formatMessage({ id: 'confirm.namePlaceholder' })}
          className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200 disabled:opacity-50"
        />
      </div>

      <div>
        <p className="font-serif text-xs uppercase tracking-[0.15em] text-stone-600">
          <FormattedMessage id="confirm.giftType" />
        </p>
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
              <FormattedMessage id={option.labelId} />
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="font-serif text-xs uppercase tracking-[0.15em] text-stone-600">
          <FormattedMessage id="confirm.destination" />
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
                <FormattedMessage id={option.labelId} values={{ name: option.name }} />
              </label>
            ))
          ) : (
            <p className="text-sm text-stone-800">
              <FormattedMessage id="confirm.giftNote" />
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-md bg-stone-900 px-4 py-3 font-serif text-xs uppercase tracking-[0.2em] text-white transition hover:bg-stone-700 disabled:opacity-50"
      >
        <FormattedMessage id={saving ? 'confirm.submitting' : 'confirm.submit'} />
      </button>
    </form>
  )
}

export default GiftConfirmationForm
