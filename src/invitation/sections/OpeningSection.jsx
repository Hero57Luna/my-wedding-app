import { FormattedMessage, useIntl } from 'react-intl'
import { OPENING_IMAGE } from '../assets'
import AnimatedSection from '../components/AnimatedSection'

function OpeningSection() {
  const intl = useIntl()

  return (
    <AnimatedSection className="pt-4" page={1}>
      <p className="text-right font-serif text-xs uppercase tracking-[0.2em] text-stone-500">
        <FormattedMessage id="opening.date" />
      </p>
      <h2 className="text-center mt-3 font-chomsky text-4xl leading-none text-stone-900 sm:text-5xl">
        <FormattedMessage id="opening.title" />
      </h2>
      <div className="mt-4 flex items-center justify-between border-t border-stone-800 pt-2 font-serif text-sm text-stone-700">
        <p>
          <FormattedMessage id="common.familyFriends" />
        </p>
        <p>
          <FormattedMessage id="opening.invited" />
        </p>
      </div>

      <figure className="mt-5 overflow-hidden border border-stone-300 bg-stone-100">
        <img
          src={OPENING_IMAGE}
          alt={intl.formatMessage({ id: 'common.coupleAlt' })}
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </figure>

      <div className="mt-6 text-center">
        <h3 className="font-serif text-lg font-bold uppercase tracking-[0.08em] text-stone-900">
          <FormattedMessage id="opening.greeting" />
        </h3>
        <p className="mt-3 font-serif text-sm leading-relaxed text-stone-600">
          <FormattedMessage id="opening.body" />
        </p> <br />
        <p className="mt-3 whitespace-pre-line font-serif text-sm leading-relaxed text-stone-600">
          <FormattedMessage id="opening.signOff" />
        </p>
      </div>
    </AnimatedSection>
  )
}

export default OpeningSection
