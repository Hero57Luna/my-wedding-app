import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../firebase/config'

const PAGE_SIZE = 5
// ponytail: live window of the newest 100 wishes, paged client-side. Swap to
// startAfter() cursors if the guest list ever outgrows that.
const WINDOW = 100

const wishesRef = collection(db, 'best-wishes')

function BestWishesForm({ guestId }) {
  const intl = useIntl()
  const [from, setFrom] = useState('')
  const [wishes, setWishes] = useState('')
  const [attending, setAttending] = useState(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)

  useEffect(() => {
    return onSnapshot(
      query(wishesRef, orderBy('createdAt', 'desc'), limit(WINDOW)),
      (snapshot) => {
        setItems(
          snapshot.docs.map((docSnap) => {
            const data = docSnap.data()
            return {
              id: docSnap.id,
              from: data.from ?? '',
              wishes: data.wishes ?? '',
              attending: data.attending ?? null,
              createdAt: data.createdAt?.toDate() ?? null,
            }
          }),
        )
      },
      (err) => {
        console.error(err)
        setStatus({ type: 'error', text: intl.formatMessage({ id: 'form.error' }) })
      },
    )
  }, [intl])

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const visible = items.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!from.trim() || !wishes.trim() || attending === null || saving) return

    setSaving(true)
    setStatus(null)
    try {
      await addDoc(wishesRef, {
        from: from.trim(),
        wishes: wishes.trim(),
        attending,
        createdAt: serverTimestamp(),
      })
      if (guestId) {
        await updateDoc(doc(db, 'guests', guestId), { rsvp: attending })
      }
      setStatus({ type: 'success', text: intl.formatMessage({ id: 'wishes.success' }) })
      setFrom('')
      setWishes('')
      setAttending(null)
      setPage(0)
    } catch (err) {
      console.error(err)
      setStatus({ type: 'error', text: intl.formatMessage({ id: 'form.error' }) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-10">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-stone-300 bg-stone-50 p-5"
      >
        <div>
          <h4 className="font-serif text-lg font-bold text-stone-900">
            <FormattedMessage id="wishes.title" />
          </h4>
          <p className="mt-1 text-xs italic leading-relaxed text-stone-500">
            <FormattedMessage id="wishes.subtitle" />
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
            htmlFor="wish-from"
            className="block font-serif text-xs uppercase tracking-[0.15em] text-stone-600"
          >
            <FormattedMessage id="common.name" />
          </label>
          <input
            id="wish-from"
            type="text"
            required
            maxLength={60}
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            disabled={saving}
            placeholder={intl.formatMessage({ id: 'wishes.namePlaceholder' })}
            className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200 disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="wish-text"
            className="block font-serif text-xs uppercase tracking-[0.15em] text-stone-600"
          >
            <FormattedMessage id="wishes.label" />
          </label>
          <textarea
            id="wish-text"
            required
            rows={4}
            maxLength={500}
            value={wishes}
            onChange={(event) => setWishes(event.target.value)}
            disabled={saving}
            placeholder={intl.formatMessage({ id: 'wishes.placeholder' })}
            className="mt-2 w-full resize-none rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200 disabled:opacity-50"
          />
        </div>

        <div>
          <span className="block font-serif text-xs uppercase tracking-[0.15em] text-stone-600">
            <FormattedMessage id="wishes.rsvp" />
          </span>
          <div className="mt-2 flex flex-col gap-2">
            <label className="flex items-center justify-between gap-3 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700">
              <FormattedMessage id="wishes.rsvpYes" />
              <input
                type="checkbox"
                checked={attending === true}
                onChange={() => setAttending(true)}
                disabled={saving}
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700">
              <FormattedMessage id="wishes.rsvpNo" />
              <input
                type="checkbox"
                checked={attending === false}
                onChange={() => setAttending(false)}
                disabled={saving}
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-md bg-stone-900 px-4 py-3 font-serif text-xs uppercase tracking-[0.2em] text-white transition hover:bg-stone-700 disabled:opacity-50"
        >
          <FormattedMessage id={saving ? 'wishes.submitting' : 'wishes.submit'} />
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {visible.length === 0 ? (
          <p className="text-sm italic text-stone-500">
            <FormattedMessage id="wishes.empty" />
          </p>
        ) : (
          visible.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <header className="flex items-baseline justify-between gap-3">
                <p className="flex min-w-0 items-baseline gap-2 truncate font-serif text-sm font-bold text-stone-900">
                  <span className="font-serif text-xs uppercase">{item.from}</span>
                  {item.attending !== null && (
                    <span
                      className={`font-serif text-xs uppercase tracking-wide ${
                        item.attending ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      <FormattedMessage id={item.attending ? 'wishes.rsvpYesShort' : 'wishes.rsvpNoShort'} />
                    </span>
                  )}
                </p>
                <p className="shrink-0 text-xs text-stone-400">
                  {item.createdAt
                    ? intl.formatDate(item.createdAt, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : ''}
                </p>
              </header>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-stone-600">
                {item.wishes}
              </p>
            </article>
          ))
        )}
      </div>

      {items.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage(safePage - 1)}
            disabled={safePage === 0}
            className="font-serif text-xs uppercase tracking-[0.15em] text-stone-700 underline underline-offset-4 transition hover:text-stone-500 disabled:opacity-30"
          >
            <FormattedMessage id="wishes.previous" />
          </button>
          <span className="text-xs text-stone-500">
            {safePage + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage(safePage + 1)}
            disabled={safePage >= pageCount - 1}
            className="font-serif text-xs uppercase tracking-[0.15em] text-stone-700 underline underline-offset-4 transition hover:text-stone-500 disabled:opacity-30"
          >
            <FormattedMessage id="wishes.next" />
          </button>
        </div>
      )}
    </div>
  )
}

export default BestWishesForm
