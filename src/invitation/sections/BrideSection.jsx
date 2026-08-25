import { FormattedMessage, useIntl } from 'react-intl'
import { BRIDE_IMAGE } from '../assets'
import AnimatedSection from '../components/AnimatedSection'
import SectionLabel from '../components/SectionLabel'

function BrideSection() {
  const intl = useIntl()

  return (
    <AnimatedSection page={3}>
      <h3 className="text-right font-chomsky text-4xl leading-none text-stone-900">
        <FormattedMessage id="bride.heading" />
      </h3>
      <div className="mt-3">
        <SectionLabel label="Dhela" endLabel="#DHEstinedforBAGAS" align="right" />
      </div>

      <figure className="mt-5 overflow-hidden border border-stone-300 bg-stone-200/50">
        <img
          src={BRIDE_IMAGE}
          alt="Dhelanda La Nina Dwipa Tiara Andiyani"
          className="aspect-[4/5] w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </figure>

      <h4 className="mt-5 text-right font-serif text-xl font-bold text-stone-900">
        Dhelanda La Nina Dwipa Tiara Andiyani
      </h4>
      <p className="mt-2 whitespace-pre-line text-right text-sm leading-relaxed text-stone-600">
        <FormattedMessage id="bride.parents" />
      </p>

      <a
        href="https://www.instagram.com/dhelandiyani?igsh=MXduc3ppZnF1aXBuaA=="
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-right font-serif text-xs font-bold uppercase tracking-widest text-stone-800 underline underline-offset-4 transition-colors hover:text-stone-500"
      >
        {intl.formatMessage({ id: 'common.instagram' })}
      </a>
    </AnimatedSection>
  )
}

export default BrideSection
