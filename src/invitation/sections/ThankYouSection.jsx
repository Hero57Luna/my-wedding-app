import { FormattedMessage, useIntl } from 'react-intl'
import { GALLERY_IMAGES } from '../assets'
import AnimatedSection from '../components/AnimatedSection'
import SectionLabel from '../components/SectionLabel'

function ThankYouSection() {
  const intl = useIntl()

  return (
    <AnimatedSection page={9}>
      <SectionLabel />

      <h3 className="mt-5 text-center font-chomsky text-4xl leading-none text-stone-900">
        <FormattedMessage id="thankyou.heading" />
      </h3>

      <figure className="mt-4 overflow-hidden border border-stone-300">
        <img
          src={GALLERY_IMAGES[2]}
          alt={intl.formatMessage({ id: 'common.coupleAlt' })}
          className="aspect-[4/3] w-full object-cover"
        />
      </figure>

      <p className="mt-4 text-center text-sm leading-relaxed text-stone-600">
        <FormattedMessage id="thankyou.message" />
      </p>

      <p className="mt-6 whitespace-pre-line text-center font-serif text-2xl text-stone-600">
        <strong><FormattedMessage id="gift.signOff"/></strong>
      </p>
    </AnimatedSection>
  )
}

export default ThankYouSection
