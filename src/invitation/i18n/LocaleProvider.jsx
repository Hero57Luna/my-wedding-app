import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IntlProvider } from 'react-intl'
import { LocaleContext } from './localeContext'
import en from './en.json'
import id from './id.json'

const MESSAGES = { en, id }
// <b> is available to every message; line breaks are plain \n plus whitespace-pre-line.
const RICH_TEXT = { b: (chunks) => <strong>{chunks}</strong> }
const DEFAULT_LOCALE = 'en'
// Day-first dates in both languages, so wish timestamps match the invitation copy.
const INTL_LOCALES = { en: 'en-GB', id: 'id-ID' }
const STORAGE_KEY = 'invitation_locale'
// Keep in sync with the duration-300 class in LocaleFade.
const FADE_MS = 300

function readStoredLocale() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored && stored in MESSAGES ? stored : DEFAULT_LOCALE
}

function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(readStoredLocale)
  const [isFading, setIsFading] = useState(false)
  const fadeTimerRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => () => clearTimeout(fadeTimerRef.current), [])

  // Fade the copy out, swap it while it is invisible, then fade it back in.
  const setLocale = useCallback(
    (next) => {
      if (next === locale || fadeTimerRef.current) return
      setIsFading(true)
      fadeTimerRef.current = setTimeout(() => {
        fadeTimerRef.current = null
        setLocaleState(next)
        setIsFading(false)
      }, FADE_MS)
    },
    [locale],
  )

  const value = useMemo(() => ({ locale, setLocale, isFading }), [locale, setLocale, isFading])

  return (
    <LocaleContext.Provider value={value}>
      <IntlProvider
        locale={INTL_LOCALES[locale]}
        defaultLocale={DEFAULT_LOCALE}
        messages={MESSAGES[locale]}
        defaultRichTextElements={RICH_TEXT}
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  )
}

export default LocaleProvider
