import { FormattedMessage } from 'react-intl'

function SectionFooter({ page, dark = false }) {
  const textColor = dark ? 'text-stone-400' : 'text-stone-500'
  const ruleColor = dark ? 'border-stone-700' : 'border-stone-300'

  return (
    <footer className={`mt-8 w-full border-t ${ruleColor} pt-3`}>
      <div className={`flex items-center justify-between font-serif text-xs uppercase tracking-[0.2em] ${textColor}`}>
        <p>
          <FormattedMessage id="footer.title" />
        </p>
        <p>
          <FormattedMessage id="footer.page" values={{ page }} />
        </p>
      </div>
    </footer>
  )
}

export default SectionFooter
