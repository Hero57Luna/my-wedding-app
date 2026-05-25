function AudioToggleButton({ isMuted, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-stone-100"
      aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
    >
      <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`} />
      <span className="font-medium">{isMuted ? 'Muted' : 'Playing'}</span>
    </button>
  )
}

export default AudioToggleButton
