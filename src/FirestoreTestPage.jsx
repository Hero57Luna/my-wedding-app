import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from './firebase/config'
import { getAuth } from 'firebase/auth'

export default function FirestoreTestPage() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null) // { type: 'success' | 'error', text: string }
  const [saving, setSaving] = useState(false)

  const auth = getAuth()

  console.log(auth.currentUser)
  console.log(auth.currentUser?.isAnonymous)
  
  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    try {
      await addDoc(collection(db, 'test'), {
        message,
        createdAt: new Date(),
      })
      setStatus({ type: 'success', text: 'Document written successfully.' })
      setMessage('')
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 px-6 py-4">
          <h1 className="font-serif text-xl text-stone-900">Firestore Rule Test</h1>
          <p className="mt-1 text-xs text-stone-500">
            This page is public. Writing will succeed only if Firestore rules allow it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
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
              htmlFor="test-message"
              className="block font-serif text-xs uppercase tracking-[0.12em] text-stone-600"
            >
              Message
            </label>
            <input
              id="test-message"
              type="text"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={saving}
              placeholder="Type anything…"
              className="mt-1.5 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-stone-800 px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-white transition hover:bg-stone-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save to Firestore'}
          </button>
        </form>
      </div>
    </div>
  )
}
