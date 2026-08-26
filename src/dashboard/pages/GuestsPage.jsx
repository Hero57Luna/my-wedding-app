import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useGuestList } from '../hooks/useGuestList'
import { addGuest, updateGuest, deleteGuest, GUESTS_PAGE_SIZE } from '../services/guests'

const DEBOUNCE_MS = 300

const SESSION_OPTIONS = [
  { label: 'First - 12:00 - 13:30 WIB', value: '12:00 - 13:30 WIB' },
  { label: 'Second - 13:00 - 14:30 WIB', value: '13:00 - 14:30 WIB' },
]

const BASE_WEDDING_URL = import.meta.env.VITE_BASE_WEDDING_URL

function GuestDetailModal({ guest, onClose }) {
  const invitationUrl = BASE_WEDDING_URL ? `${BASE_WEDDING_URL}?ref=${guest.id}` : null
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(invitationUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const fields = [
    { label: 'Name', value: guest.name || '—' },
    { label: 'Address', value: guest.address || '—' },
    { label: 'Present', value: guest.present ? 'Yes' : 'No' },
    { label: 'VIP', value: guest.vip ? 'Yes' : '-' },
    { label: 'Session', value: guest.time || '—' },
    { label: 'Arrival', value: guest.arrival ? guest.arrival.toLocaleString() : '-' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-modal-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-sm rounded-xl border border-stone-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h3
            id="guest-modal-title"
            className="font-serif text-lg text-stone-900"
          >
            Guest Detail
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <dl className="divide-y divide-stone-100 px-6 py-2">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4 py-3">
              <dt className="font-serif text-xs uppercase tracking-[0.12em] text-stone-500">{label}</dt>
              <dd className="text-right text-sm text-stone-800 break-words max-w-[60%]">{value}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="font-serif text-xs uppercase tracking-[0.12em] text-stone-500">Invitation URL</dt>
            <dd>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!invitationUrl}
                className="rounded border border-stone-300 bg-white px-2.5 py-1 font-serif text-xs uppercase tracking-[0.12em] text-stone-600 transition hover:bg-stone-50 hover:text-stone-900 disabled:opacity-50"
              >
                {invitationUrl ? (copied ? 'Copied!' : 'Copy Link') : 'Unavailable'}
              </button>
            </dd>
          </div>
        </dl>
      </motion.div>
    </motion.div>
  )
}

const EMPTY_FORM = { name: '', address: '', gender: 'male', present: 'true', vip: 'false', time: SESSION_OPTIONS[0].value }

function AddGuestModal({ onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await addGuest({
        name: form.name,
        address: form.address,
        gender: form.gender,
        present: form.present === 'true',
        vip: form.vip === 'true',
        time: form.time,
      })
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add guest')
      setSaving(false)
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200 disabled:opacity-50'
  const labelClass = 'block font-serif text-xs uppercase tracking-[0.12em] text-stone-600'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-guest-modal-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-md rounded-xl border border-stone-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h3 id="add-guest-modal-title" className="font-serif text-lg text-stone-900">
            Add Guest
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <div>
            <label htmlFor="ag-name" className={labelClass}>Name</label>
            <input
              id="ag-name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              disabled={saving}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="ag-address" className={labelClass}>Address</label>
            <input
              id="ag-address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              disabled={saving}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ag-gender" className={labelClass}>Gender</label>
              <select
                id="ag-gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                disabled={saving}
                className={inputClass}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="ag-present" className={labelClass}>Present</label>
              <select
                id="ag-present"
                name="present"
                value={form.present}
                onChange={handleChange}
                disabled={saving}
                className={inputClass}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="ag-vip" className={labelClass}>VIP</label>
            <select
              id="ag-vip"
              name="vip"
              value={form.vip}
              onChange={handleChange}
              disabled={saving}
              className={inputClass}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div>
            <label htmlFor="ag-time" className={labelClass}>Session</label>
            <select
              id="ag-time"
              name="time"
              value={form.time}
              onChange={handleChange}
              disabled={saving}
              className={inputClass}
            >
              {SESSION_OPTIONS.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-stone-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-md border border-stone-300 bg-white px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-stone-800 px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-white transition hover:bg-stone-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Add Guest'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function EditGuestModal({ guest, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: guest.name,
    address: guest.address,
    gender: guest.gender ?? 'male',
    present: guest.present ? 'true' : 'false',
    vip: guest.vip ? 'true' : 'false',
    time: guest.time || SESSION_OPTIONS[0].value,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await updateGuest(guest.id, {
        name: form.name,
        address: form.address,
        gender: form.gender,
        present: form.present === 'true',
        vip: form.vip === 'true',
        time: form.time,
      })
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update guest')
      setSaving(false)
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200 disabled:opacity-50'
  const labelClass = 'block font-serif text-xs uppercase tracking-[0.12em] text-stone-600'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-guest-modal-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-md rounded-xl border border-stone-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h3 id="edit-guest-modal-title" className="font-serif text-lg text-stone-900">
            Edit Guest
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <div>
            <label htmlFor="eg-name" className={labelClass}>Name</label>
            <input
              id="eg-name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              disabled={saving}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eg-address" className={labelClass}>Address</label>
            <input
              id="eg-address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              disabled={saving}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="eg-gender" className={labelClass}>Gender</label>
              <select
                id="eg-gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                disabled={saving}
                className={inputClass}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="eg-present" className={labelClass}>Present</label>
              <select
                id="eg-present"
                name="present"
                value={form.present}
                onChange={handleChange}
                disabled={saving}
                className={inputClass}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="eg-vip" className={labelClass}>VIP</label>
            <select
              id="eg-vip"
              name="vip"
              value={form.vip}
              onChange={handleChange}
              disabled={saving}
              className={inputClass}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div>
            <label htmlFor="eg-time" className={labelClass}>Session</label>
            <select
              id="eg-time"
              name="time"
              value={form.time}
              onChange={handleChange}
              disabled={saving}
              className={inputClass}
            >
              {SESSION_OPTIONS.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-stone-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-md border border-stone-300 bg-white px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-stone-800 px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-white transition hover:bg-stone-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function DeleteConfirmModal({ guest, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    try {
      await deleteGuest(guest.id)
      onDeleted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete guest')
      setDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-guest-modal-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-sm rounded-xl border border-stone-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h3 id="delete-guest-modal-title" className="font-serif text-lg text-stone-900">
            Remove Guest
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            aria-label="Close"
            className="rounded-md p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <p className="text-sm text-stone-700">
            Are you sure you want to remove{' '}
            <span className="font-semibold text-stone-900">{guest.name}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 border-t border-stone-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="rounded-md border border-stone-300 bg-white px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-md bg-red-600 px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? 'Removing…' : 'Remove'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function GuestsPage() {
  const {
    searchInput,
    setSearchInput,
    guests,
    loading,
    error,
    pageIndex,
    hasNext,
    goNext,
    goPrev,
    togglePresent,
    updatingIds,
    isDebouncing,
    refresh,
  } = useGuestList()

  const [selectedGuest, setSelectedGuest] = useState(null)
  const [editGuest, setEditGuest] = useState(null)
  const [deleteGuest, setDeleteGuest] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  function handleGuestSaved() {
    setShowAddModal(false)
    refresh()
  }

  function handleGuestUpdated() {
    setEditGuest(null)
    refresh()
  }

  function handleGuestDeleted() {
    setDeleteGuest(null)
    refresh()
  }

  const isBusy = loading || isDebouncing
  const pageNumber = pageIndex + 1

  return (
    <div>
      <header className="flex items-start justify-between gap-4 border-b border-stone-300 pb-6">
        <div>
          <h2 className="font-serif text-3xl text-stone-900">Guest</h2>
          <p className="mt-2 text-stone-600">Search and manage guests.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="shrink-0 rounded-md bg-stone-800 px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-white transition hover:bg-stone-700"
        >
          + Add Guest
        </button>
      </header>

      <div className="mt-6">
        <label
          htmlFor="guest-search"
          className="block font-serif text-xs uppercase tracking-[0.15em] text-stone-600"
        >
          Search guests
        </label>
        <input
          id="guest-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by name or address…"
          className="mt-2 w-full max-w-md rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
        />
      </div>

      {error ? (
        <p
          className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 font-serif text-xs uppercase tracking-[0.12em] text-stone-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3 text-center">Present</th>
              <th className="px-4 py-3 text-center">VIP</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100" aria-busy={isBusy}>
            {isBusy ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-stone-500">
                  Loading guests…
                </td>
              </tr>
            ) : guests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-stone-500">
                  No guests found.
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr key={guest.id} className="text-stone-800">
                  <td className="max-w-[16rem] truncate px-4 py-3" title={guest.name}>{guest.name}</td>
                  <td className="max-w-[16rem] truncate px-4 py-3" title={guest.address || '—'}>{guest.address || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={guest.present}
                      disabled={updatingIds.has(guest.id)}
                      aria-label={`Mark ${guest.name} as present`}
                      onChange={(event) =>
                        togglePresent(guest.id, event.target.checked)
                      }
                      className="h-4 w-4 rounded border-stone-300 text-stone-800 focus:ring-stone-400 disabled:opacity-50"
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-stone-700">
                    {guest.vip ? 'Yes' : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditGuest(guest)}
                        className="rounded border border-stone-300 bg-white px-2.5 py-1 font-serif text-xs uppercase tracking-[0.12em] text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedGuest(guest)}
                        className="rounded border border-stone-300 bg-white px-2.5 py-1 font-serif text-xs uppercase tracking-[0.12em] text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteGuest(guest)}
                        className="rounded border border-red-200 bg-white px-2.5 py-1 font-serif text-xs uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-50 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-600">
          Page {pageNumber} · {GUESTS_PAGE_SIZE} guests per page
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={pageIndex === 0 || isBusy}
            className="rounded-md border border-stone-300 bg-white px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!hasNext || isBusy}
            className="rounded-md border border-stone-300 bg-white px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedGuest && (
          <GuestDetailModal guest={selectedGuest} onClose={() => setSelectedGuest(null)} />
        )}
        {editGuest && (
          <EditGuestModal guest={editGuest} onClose={() => setEditGuest(null)} onSaved={handleGuestUpdated} />
        )}
        {deleteGuest && (
          <DeleteConfirmModal guest={deleteGuest} onClose={() => setDeleteGuest(null)} onDeleted={handleGuestDeleted} />
        )}
        {showAddModal && (
          <AddGuestModal onClose={() => setShowAddModal(false)} onSaved={handleGuestSaved} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default GuestsPage
