import { useEffect, useState } from 'react'
import { MAIN_IMAGE } from '../assets'
import AnimatedSection from '../components/AnimatedSection'
import SectionLabel from '../components/SectionLabel'

// WIB (UTC+7) so the countdown is identical for every guest, wherever they open it.
const EVENT_AT = Date.parse('2026-09-06T07:00:00+07:00')

function remaining() {
  const ms = Math.max(0, EVENT_AT - Date.now())
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000) % 24,
    minutes: Math.floor(ms / 60000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  }
}

function Unit({ value, label }) {
  return (
    <div className="flex-1 text-center">
      <p className="font-serif text-3xl font-bold tabular-nums text-stone-900 sm:text-4xl">
        {String(value).padStart(2, '0')}
      </p>
      <p className="mt-1 font-serif text-[0.65rem] uppercase tracking-[0.2em] text-stone-500">
        {label}
      </p>
    </div>
  )
}

function CountdownSection() {
  const [time, setTime] = useState(remaining)

  useEffect(() => {
    const id = setInterval(() => setTime(remaining()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <AnimatedSection page={4}>
      <h3 className="text-center font-chomsky text-4xl leading-none text-stone-900">Happily Ever After Begins In</h3>
      <div className="mt-3">
        <SectionLabel label="6 September 2026" endLabel="07:00 WIB" />
      </div>

      <figure className="mt-5 overflow-hidden border border-stone-300 bg-stone-200/50">
        <img
          src={MAIN_IMAGE}
          alt="Bagas and Dhela"
          className="aspect-[4/3] w-full object-cover"
        />
      </figure>

      <div className="mt-5 flex items-start divide-x divide-stone-300 border border-stone-900 px-2 py-6">
        <Unit value={time.days} label="Days" />
        <Unit value={time.hours} label="Hours" />
        <Unit value={time.minutes} label="Minutes" />
        <Unit value={time.seconds} label="Seconds" />
      </div>
    </AnimatedSection>
  )
}

export default CountdownSection
