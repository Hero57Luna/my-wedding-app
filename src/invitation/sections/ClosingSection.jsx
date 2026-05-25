import AnimatedSection from '../components/AnimatedSection'

function ClosingSection() {
  return (
    <AnimatedSection className="pb-4" page={6}>
      <h3 className="font-chomsky text-2xl text-stone-900">Closing Message</h3>
      <p className="mt-4 text-sm leading-relaxed text-stone-700">
        It would be our greatest honor to have your presence and blessings as we
        begin our journey as husband and wife.
      </p>

      <p className="mt-6 border-l-2 border-stone-300 pl-4 font-serif text-lg italic text-stone-700">
        With love,
        <br />
        Bagas & Dhela
      </p>
    </AnimatedSection>
  )
}

export default ClosingSection
