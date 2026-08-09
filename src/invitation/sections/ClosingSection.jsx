import { GALLERY_IMAGES } from '../assets'
import AnimatedSection from '../components/AnimatedSection'
import SectionLabel from '../components/SectionLabel'

function ClosingSection() {
  return (
    <AnimatedSection className="pb-4" page={7}>
      <SectionLabel label="Best Wishes" />

      <figure className="mt-4 overflow-hidden border border-stone-300">
        <img
          src={GALLERY_IMAGES[1]}
          alt="Bagas and Dhela"
          className="aspect-[4/3] w-full object-cover"
        />
      </figure>

      <p className="mt-6 text-sm leading-relaxed text-stone-700">
        It would be our greatest honor to have your presence and blessings as we
        begin our journey as husband and wife.
      </p>

      <p className="mt-6 font-serif text-lg italic text-stone-800">
        With love,
        <br />
        Bagas &amp; Dhela
      </p>
    </AnimatedSection>
  )
}

export default ClosingSection
