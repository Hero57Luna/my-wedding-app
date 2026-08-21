import { useIntl } from 'react-intl'

function AudioToggleButton({ isMuted, onToggle }) {
  const intl = useIntl()

  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-stone-100"
      aria-label={intl.formatMessage({ id: isMuted ? 'audio.unmute' : 'audio.mute' })}
    >
      <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`} />
      <span className="font-medium">
        {intl.formatMessage({ id: isMuted ? 'audio.muted' : 'audio.playing' })}
      </span>
    </button>
  )
}

export default AudioToggleButton
