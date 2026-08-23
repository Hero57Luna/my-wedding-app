import { FormattedMessage, useIntl } from 'react-intl'
import { EVENT_TIMES, MAIN_IMAGE } from '../assets'
import AnimatedSection from '../components/AnimatedSection'

const MAPS_URL = 'https://maps.app.goo.gl/c5F645zUXDJhymgv8?g_st=ic'

function EventBlock({ titleId, time }) {
  return (
    <div className="text-center">
      <h4 className="font-serif text-lg font-bold uppercase tracking-[0.08em] text-stone-900">
        <FormattedMessage id={titleId} />
      </h4>
      <p className="mt-2 text-sm text-stone-700">
        <FormattedMessage id="common.fullDate" />
      </p>
      <p className="text-sm text-stone-700">
        <FormattedMessage id="event.time" values={{ time }} />
      </p>

      <p className="mt-4 font-serif text-sm font-bold text-stone-900">
        <FormattedMessage id="event.venueName" />
      </p>
      <p className="text-sm text-stone-600">
        <FormattedMessage id="event.venueAddress" />
      </p>

      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block font-serif text-xs font-bold uppercase tracking-widest text-stone-800 underline underline-offset-4 transition-colors hover:text-stone-500"
      >
        <FormattedMessage id="event.viewLocation" />
      </a>
    </div>
  )
}

function EventDetailsSection({ receptionTime }) {
  const intl = useIntl()

  return (
    <AnimatedSection page={5}>
      <div className="border border-stone-900 p-5 sm:p-6">
        <h3 className="text-center font-chomsky text-5xl leading-none text-stone-900">
          <FormattedMessage id="event.heading" />
        </h3>

        <figure className="mt-5 overflow-hidden border border-stone-300">
          <img
            src={MAIN_IMAGE}
            alt={intl.formatMessage({ id: 'common.coupleAlt' })}
            className="aspect-[4/3] w-full object-cover"
          />
        </figure>

        <div className="mt-6">
          <EventBlock titleId="event.ceremony" time={EVENT_TIMES.time0} />
        </div>

        <div className="mt-8 border-t border-stone-300 pt-8">
          <EventBlock titleId="event.reception" time={receptionTime} />
        </div>
      </div>
    </AnimatedSection>
  )
}

export default EventDetailsSection
