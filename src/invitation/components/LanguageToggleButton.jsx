import { useIntl } from 'react-intl'
import { useLocale } from '../i18n/useLocale'

function LanguageToggleButton() {
  const intl = useIntl()
  const { locale, setLocale } = useLocale()

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
      className="fixed bottom-20 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-stone-100"
      aria-label={intl.formatMessage({ id: 'common.language' })}
    >
      <i className="fa-solid fa-language" />
      <span className="font-medium uppercase">{locale}</span>
    </button>
  )
}

export default LanguageToggleButton
