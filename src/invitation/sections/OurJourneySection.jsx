import { GALLERY_IMAGES } from '../assets'
import AnimatedSection from '../components/AnimatedSection'
import SectionLabel from '../components/SectionLabel'

const milestones = [
  {
    date: '2012',
    title: 'How We Met',
    text: 'Our story began in junior high school, where a simple friendship grew through endless conversations, shared laughter, and countless memories.'
  },
  {
    date: '2017',
    title: 'A New Chapter',
    text: 'For the first time, we left our hometown together to pursue higher education. Stepping into an unfamiliar world felt less daunting because we had each other by our side.'
  },
  {
    date: '2020',
    title: 'Through Every Storm',
    text: 'Life tested us in ways we never expected. Despite the challenges, uncertainties, and distance between dreams and reality, we chose to stay, grow, and fight for our future together.'
  },
  {
    date: '2025',
    title: 'Building Our Future',
    text: 'What once felt like distant dreams began to take shape. Together, we made plans for the life we had always imagined, one filled with love, purpose, and a shared future.'
  },
  {
    date: '2026',
    title: 'Forever Begins',
    text: 'This is the year we choose each other for a lifetime. On 6 September 2026, surrounded by our loved ones, we begin our greatest adventure as husband and wife.'
  },
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

      <h3 className="mt-5 font-chomsky text-3xl leading-tight text-stone-900">
        A Journey of Bagas &amp; Dhela
      </h3>

      <div className="mt-5 space-y-6">
        {milestones.map((item) => (
          <article key={`${item.date}-${item.title}`}>
            <p className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
              {item.date}
            </p>
            <h4 className="mt-1 font-serif text-lg font-bold text-stone-900">{item.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.text}</p>
          </article>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default OurJourneySection
