import { OPENING_IMAGE } from '../assets'
import AnimatedSection from '../components/AnimatedSection'

function OpeningSection() {
  return (
    <AnimatedSection className="pt-4" page={1}>
      <p className="text-right font-serif text-xs uppercase tracking-[0.2em] text-stone-500">
        Sunday, 6 September 2026
      </p>
      <h2 className="text-center mt-3 font-chomsky text-4xl leading-none text-stone-900 sm:text-5xl">
        Our Wedding Day
      </h2>
      <div className="mt-4 flex items-center justify-between border-t border-stone-800 pt-2 font-serif text-sm text-stone-700">
        <p>Family &amp; Friends</p>
        <p>You&apos;re Invited</p>
      </div>

      <figure className="mt-5 overflow-hidden border border-stone-300 bg-stone-100">
        <img
          src={OPENING_IMAGE}
          alt="Bagas and Dhela"
          className="aspect-[4/3] w-full object-cover"
        />
      </figure>

      <div className="mt-6 text-center">
        <h3 className="font-serif text-lg font-bold uppercase tracking-[0.08em] text-stone-900">
          Dear Family & Friends
        </h3>
        <p className="mt-3 font-serif text-sm leading-relaxed text-stone-600">
          We're so happy to invite you to share this meaningful day with us. Your presence will make our wedding even more special.
        </p> <br />
        <p className="mt-3 font-serif text-sm leading-relaxed text-stone-600">
          With love, <br />
          <strong>Dhela & Bagas</strong>
        </p>
      </div>
    </AnimatedSection>
  )
}

export default OpeningSection
