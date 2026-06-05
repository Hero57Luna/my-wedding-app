import { GALLERY_IMAGES } from '../assets'
import AnimatedSection from '../components/AnimatedSection'

function GallerySection() {
  return (
    <AnimatedSection page={5}>
      <h3 className="font-chomsky text-4xl text-stone-900">Gallery</h3>
      <p className="mt-2 text-sm text-stone-600">
        Moments that brought us to this beautiful day.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {GALLERY_IMAGES.map((image, index) => (
          <figure key={image} className="overflow-hidden rounded-md bg-stone-200">
            <img
              src={image}
              alt={`Prewedding moment ${index + 1}`}
              className="h-36 w-full object-cover transition duration-500 hover:scale-105"
            />
          </figure>
        ))}
      </div>
    </AnimatedSection>
  )
}

export default GallerySection
