import { OPENING_IMAGE } from '../assets'
import AnimatedSection from '../components/AnimatedSection'

function OpeningSection() {
  return (
    <AnimatedSection className="pt-4" page={1}>
      <p className="font-serif text-xs uppercase tracking-[0.3em] text-stone-500">
        Wedding Invitation
      </p>
      <h2 className="mt-4 font-chomsky text-4xl leading-tight text-stone-900 sm:text-5xl">
        Bagas
        <span className="mx-3 text-stone-500">&</span>
        Dhela
      </h2>
      <figure className="mt-5 overflow-hidden border border-stone-200 bg-stone-100">
        <img
          src={OPENING_IMAGE}
          alt="Bagas and Dhela"
          className="aspect-[4/3] w-full object-cover"
        />
      </figure>
      <p className="mt-4 border-l-2 border-stone-300 pl-4 font-serif text-sm italic text-stone-600">
        With joy in our hearts, we invite you to celebrate the beginning of our
        new chapter.
      </p>
      <p className="mt-5 text-sm uppercase tracking-[0.2em] text-stone-600">
        6 September 2026
      </p>
    </AnimatedSection>
  )
}

export default OpeningSection
