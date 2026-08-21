import { useIntl } from 'react-intl'
import { useLocale } from '../i18n/useLocale'

function LanguageToggleButton() {
  const { locale, setLocale } = useLocale()
  const intl = useIntl()

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
      className="inline-flex items-center gap-1.5 font-serif text-xs uppercase tracking-[0.2em] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-stone-800"
      aria-label={intl.formatMessage({ id: 'common.language' })}
    >
      <span className={locale === 'en' ? 'font-bold text-stone-900' : 'text-stone-400'}>EN</span>
      <span className="text-stone-300">/</span>
      <span className={locale === 'id' ? 'font-bold text-stone-900' : 'text-stone-400'}>ID</span>
    </button>
  )
}

export default LanguageToggleButton
