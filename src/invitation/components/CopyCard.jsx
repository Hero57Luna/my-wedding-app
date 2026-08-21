import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

/**
 * Shared "ATM card" style surface used by the wedding gift bank account and
 * shipping address cards — a soft gradient card with a dotted texture and a
 * copy-to-clipboard action in the bottom-right corner.
 */
function CopyCard({ copyValue, children }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard access denied or unavailable — silently ignore.
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-300 bg-gradient-to-br from-stone-100 via-stone-200 to-stone-300 p-5 shadow-sm">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1px)',
          backgroundSize: '10px 10px',
        }}
      />
      <div className="relative">{children}</div>
      <div className="relative mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md bg-stone-800/90 px-3 py-1.5 font-serif text-xs uppercase tracking-widest text-white transition hover:bg-stone-700"
        >
          <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`} />
          <FormattedMessage id={copied ? 'card.copied' : 'card.copy'} />
        </button>
      </div>
    </div>
  )
}

export default CopyCard
