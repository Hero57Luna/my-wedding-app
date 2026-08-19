import { GALLERY_IMAGES } from '../assets'
import AnimatedSection from '../components/AnimatedSection'
import SectionLabel from '../components/SectionLabel'

const paragraphs = [
  'Our story began in junior high school, when we first met through a mutual friend. Bagas only recently told me that he had already admired me since our first year after seeing me on Facebook, a sweet little secret I only discovered after we were already in a relationship.',
  'By our second year, simple conversations slowly turned into something more, and we began our journey together. Bagas became the first boy my father welcomed, and the first person I was ever allowed to date.',
  'From junior high to high school, university, and adulthood, we grew side by side. Our journey was never perfect. We faced distance, difficult seasons, and countless challenges, but through it all, we remained committed to loving, supporting, and understanding each other.',
  'Throughout our more than thirteen years together, we have never grown tired of one another. We still find joy in growing together, and even now, we can’t believe how far we’ve come.',
  'What began with two teenagers simply getting to know each other has brought us here, to a proposal, to our wedding, and to the beginning of forever.',
  'It was never easy, but we made it this far.',
  'And now, we’re ready to begin our next chapter, together, for a lifetime.'
]

function OurJourneySection() {
  return (
    <AnimatedSection page={6}>
      <SectionLabel label="Love Story" />

      <figure className="mt-4 overflow-hidden border border-stone-300">
        <img
          src={GALLERY_IMAGES[0]}
          alt="Bagas and Dhela"
          className="aspect-[4/3] w-full object-cover"
        />
      </figure>

      <h3 className="mt-5 font-serif text-3xl font-bold uppercase leading-tight text-stone-900">
        The story of Bagas &amp; Dhela
      </h3>

      <div className="mt-5 columns-2 gap-12 text-justify text-sm leading-loose text-stone-600 hyphens-auto [&>p+p]:mt-4 [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-1.5 [&>p:first-child]:first-letter:font-serif [&>p:first-child]:first-letter:text-4xl [&>p:first-child]:first-letter:font-bold [&>p:first-child]:first-letter:leading-[0.85] [&>p:first-child]:first-letter:text-stone-900">
        {paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default OurJourneySection
