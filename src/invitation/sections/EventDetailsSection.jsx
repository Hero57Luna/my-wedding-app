import { EVENT_TIMES } from '../assets'
import AnimatedSection from '../components/AnimatedSection'

function EventDetailsSection() {
  return (
    <AnimatedSection page={3}>
      <h3 className="font-chomsky text-4xl text-stone-900">Event Details</h3>

      <div className="mt-5 space-y-4">
        <div className="flex items-start gap-3 rounded-md bg-stone-100 p-4">
          <i className="fa-regular fa-calendar mt-1 text-stone-500" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Date</p>
            <p className="mt-1 text-sm font-medium text-stone-700">
              Sunday, 6 September 2026
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-md bg-stone-100 p-4">
          <i className="fa-regular fa-clock mt-1 text-stone-500" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Time</p>
            <p className="mt-1 text-sm font-medium text-stone-700">
              {EVENT_TIMES.time1} WIB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-md bg-stone-100 p-4">
          <i className="fa-solid fa-location-dot mt-1 self-start text-stone-500" />
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Location</p>
            <p className="mt-1 text-sm font-medium text-stone-700">
              Gedung Widya Harja, Probolinggo
            </p>
          </div>
          <a
            href="https://maps.app.goo.gl/c5F645zUXDJhymgv8?g_st=ic"
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1.5 rounded bg-stone-700 px-3 py-1.5 text-xs font-bold tracking-widest text-white transition-colors hover:bg-stone-900"
          >
            <i className="fa-solid fa-map-location-dot" />
            MAP
          </a>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default EventDetailsSection
