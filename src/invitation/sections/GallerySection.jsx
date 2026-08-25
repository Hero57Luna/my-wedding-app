import { FormattedMessage, useIntl } from 'react-intl'
import { GALLERY_IMAGES } from '../assets'
import AnimatedSection from '../components/AnimatedSection'
import SectionLabel from '../components/SectionLabel'

function GallerySection() {
  const intl = useIntl()

  return (
    <AnimatedSection page={7}>
      <h3 className="font-chomsky text-3xl tracking-[0.02em] text-stone-900">
        <FormattedMessage id="gallery.heading" />
      </h3>
      <div className="mt-3">
        <SectionLabel label={intl.formatMessage({ id: 'gallery.label' })} />
      </div>
      <p className="mt-4 text-center text-sm leading-relaxed text-stone-600">
        <FormattedMessage id="gallery.caption" />
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {GALLERY_IMAGES.map((image, index) => (
          <figure key={image} className="overflow-hidden border border-stone-300 bg-stone-100">
            <img
              src={image}
              alt={intl.formatMessage({ id: 'gallery.imageAlt' }, { number: index + 1 })}
              className="h-36 w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </figure>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default GallerySection
