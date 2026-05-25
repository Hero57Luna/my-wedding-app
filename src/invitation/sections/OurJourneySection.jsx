import AnimatedSection from '../components/AnimatedSection'

const milestones = [
  {
    date: '2019',
    title: 'How we met',
    text: 'We crossed paths at university and quickly found we could talk for hours about nothing and everything.',
  },
  {
    date: '2020',
    title: 'First adventure',
    text: 'Our first trip together taught us patience, laughter, and that we actually enjoy getting lost—as long as we are together.',
  },
  {
    date: '2022',
    title: 'Growing closer',
    text: 'Through careers, distance, and ordinary weekdays, we chose each other again and again.',
  },
  {
    date: '2025',
    title: 'The question',
    text: 'Under a sky full of stars, one of us asked—and the other said yes without hesitation.',
  },
  {
    date: '2026',
    title: 'Forever begins',
    text: 'On 6 September 2026 we invite you to witness the day we become husband and wife.',
  },
]

function OurJourneySection() {
  return (
    <AnimatedSection page={4}>
      <h3 className="font-chomsky text-2xl text-stone-900">Our Journey</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        A short story of how two lives became one path—leading to this celebration.
      </p>

      <div className="relative mt-6 border-l border-stone-300 pl-6">
        {milestones.map((item) => (
          <article
            key={`${item.date}-${item.title}`}
            className="relative pb-8 last:pb-0"
          >
            <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-stone-400 bg-stone-50" />
            <p className="font-serif text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
              {item.date}
            </p>
            <h4 className="mt-1 font-serif text-lg text-stone-900">{item.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.text}</p>
          </article>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default OurJourneySection
