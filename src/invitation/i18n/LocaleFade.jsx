import { useLocale } from './useLocale'

// Wraps translated copy so it cross-fades when the locale changes.
// Keep duration-300 in sync with FADE_MS in LocaleProvider.
function LocaleFade({ className = '', children }) {
  const { isFading } = useLocale()

  return (
    <div
      className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'} ${className}`}
    >
      {children}
    </div>
  )
}

export default LocaleFade
