import { GALLERY_IMAGES } from '../assets'
import AnimatedSection from '../components/AnimatedSection'
import SectionLabel from '../components/SectionLabel'

const paragraphs = [
  'Our story began in junior high school back in 2012, where a simple friendship grew through endless conversations, shared laughter, and countless memories.',
  'In 2017, for the first time, we left our hometown together to pursue higher education. Stepping into an unfamiliar world felt less daunting because we had each other by our side.',
  'Then 2020 tested us in ways we never expected. Despite the challenges, uncertainties, and distance between dreams and reality, we chose to stay, grow, and fight for our future together.',
  'By 2025, what once felt like distant dreams began to take shape. Together, we made plans for the life we had always imagined, one filled with love, purpose, and a shared future.',
  'This is the year we choose each other for a lifetime. On 6 September 2026, surrounded by our loved ones, we begin our greatest adventure as husband and wife.',
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

      <div className="mt-5 columns-2 gap-4 text-justify text-xs leading-relaxed text-stone-600 hyphens-auto [&>p+p]:mt-2 [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-1.5 [&>p:first-child]:first-letter:font-serif [&>p:first-child]:first-letter:text-4xl [&>p:first-child]:first-letter:font-bold [&>p:first-child]:first-letter:leading-[0.85] [&>p:first-child]:first-letter:text-stone-900">
        {paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default OurJourneySection
