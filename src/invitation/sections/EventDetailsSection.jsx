import AnimatedSection from '../components/AnimatedSection'

function EventDetailsSection() {
  return (
    <AnimatedSection page={3}>
      <h3 className="font-chomsky text-2xl text-stone-900">Event Details</h3>

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
              10:00 AM - 02:00 PM WIB
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-md bg-stone-100 p-4">
          <i className="fa-solid fa-location-dot mt-1 text-stone-500" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Location</p>
            <p className="mt-1 text-sm font-medium text-stone-700">
              Gedung Widya Harja, Probolinggo
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default EventDetailsSection
