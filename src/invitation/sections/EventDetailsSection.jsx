import { EVENT_TIMES, MAIN_IMAGE } from '../assets'
import AnimatedSection from '../components/AnimatedSection'

const VENUE_NAME = 'Multipurpose Widya Harja Probolinggo Building'
const VENUE_ADDRESS = 'Probolinggo, Jawa Timur'
const MAPS_URL = 'https://maps.app.goo.gl/c5F645zUXDJhymgv8?g_st=ic'

function EventBlock({ title, time }) {
  return (
    <div className="text-center">
      <h4 className="font-serif text-lg font-bold uppercase tracking-[0.08em] text-stone-900">
        {title}
      </h4>
      <p className="mt-2 text-sm text-stone-700">Sunday, 6 September 2026</p>
      <p className="text-sm text-stone-700">{time} WIB</p>

      <p className="mt-4 font-serif text-sm font-bold text-stone-900">{VENUE_NAME}</p>
      <p className="text-sm text-stone-600">{VENUE_ADDRESS}</p>

      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block font-serif text-xs font-bold uppercase tracking-widest text-stone-800 underline underline-offset-4 transition-colors hover:text-stone-500"
      >
        View Location
      </a>
    </div>
  )
}

function EventDetailsSection() {
  return (
    <AnimatedSection page={5}>
      <div className="border border-stone-900 p-5 sm:p-6">
        <h3 className="text-center font-chomsky text-5xl leading-none text-stone-900">Wedding Details</h3>

        <figure className="mt-5 overflow-hidden border border-stone-300">
          <img
            src={MAIN_IMAGE}
            alt="Bagas and Dhela"
            className="aspect-[4/3] w-full object-cover"
          />
        </figure>

        <div className="mt-6">
          <EventBlock title="Marriage Ceremony" time={EVENT_TIMES.time0} />
        </div>

        <div className="mt-8 border-t border-stone-300 pt-8">
          <EventBlock title="Reception" time={EVENT_TIMES.time2} />
        </div>
      </div>
    </AnimatedSection>
  )
}

export default EventDetailsSection
