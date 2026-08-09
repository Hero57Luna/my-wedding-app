import { GALLERY_IMAGES } from '../assets'
import AnimatedSection from '../components/AnimatedSection'
import SectionLabel from '../components/SectionLabel'

function GallerySection() {
  return (
    <AnimatedSection page={6}>
      <h3 className="font-chomsky text-3xl tracking-[0.02em] text-stone-900">
        Our Moments
      </h3>
      <div className="mt-3">
        <SectionLabel label="Portrait of us" />
      </div>
      <p className="mt-4 text-center text-sm leading-relaxed text-stone-600">
        Happy marriages begin when we marry the ones we love, and they blossom
        when we love the ones we marry.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {GALLERY_IMAGES.map((image, index) => (
          <figure key={image} className="overflow-hidden border border-stone-300 bg-stone-100">
            <img
              src={image}
              alt={`Prewedding moment ${index + 1}`}
              className="h-36 w-full object-cover"
            />
          </figure>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default GallerySection
