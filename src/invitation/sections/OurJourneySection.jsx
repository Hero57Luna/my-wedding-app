import { FormattedMessage, useIntl } from 'react-intl'
import { GALLERY_IMAGES } from '../assets'
import AnimatedSection from '../components/AnimatedSection'
import SectionLabel from '../components/SectionLabel'

const PARAGRAPH_IDS = [
  'journey.p1',
  'journey.p2',
  'journey.p3',
  'journey.p4',
  'journey.p5',
  'journey.p6',
  'journey.p7',
]

function OurJourneySection() {
  const intl = useIntl()

  return (
    <AnimatedSection page={6}>
      <SectionLabel label={intl.formatMessage({ id: 'journey.label' })} />

      <figure className="mt-4 overflow-hidden border border-stone-300">
        <img
          src={GALLERY_IMAGES[0]}
          alt={intl.formatMessage({ id: 'common.coupleAlt' })}
          className="aspect-[4/3] w-full object-cover"
        />
      </figure>

      <h3 className="mt-5 font-serif text-3xl font-bold uppercase leading-tight text-stone-900">
        <FormattedMessage id="journey.heading" />
      </h3>

      <div className="mt-5 columns-2 gap-12 text-justify text-sm leading-loose text-stone-600 hyphens-auto [&>p+p]:mt-4 [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-1.5 [&>p:first-child]:first-letter:font-serif [&>p:first-child]:first-letter:text-4xl [&>p:first-child]:first-letter:font-bold [&>p:first-child]:first-letter:leading-[0.85] [&>p:first-child]:first-letter:text-stone-900">
        {PARAGRAPH_IDS.map((id) => (
          <p key={id}>
            <FormattedMessage id={id} />
          </p>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default OurJourneySection
