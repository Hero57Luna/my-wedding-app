import { GALLERY_IMAGES } from '../assets'
import AnimatedSection from '../components/AnimatedSection'
import BestWishesForm from '../components/BestWishesForm'
import SectionLabel from '../components/SectionLabel'

function WeddingGiftSection({ onOpenGift }) {
  return (
    <AnimatedSection className="pb-4" page={8}>
      <h3 className="font-chomsky text-4xl leading-none text-stone-900">Wedding Gift</h3>

      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        Your presence is a present in itself. But if you do wish to give us
        something else, please tap the button down below for further
        information:
      </p>

      <button
        type="button"
        onClick={onOpenGift}
        className="mt-6 font-serif text-md font-bold uppercase tracking-widest text-stone-800 underline underline-offset-4 transition-colors hover:text-stone-500"
      >
        Wedding Gift
      </button>

      <div className="mt-10">
        <SectionLabel label="Best Wishes" />
      </div>

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

      <BestWishesForm />

      <p className="mt-6 font-serif text-lg italic text-stone-800">
        With love,
        <br />
        Bagas &amp; Dhela
      </p>
    </AnimatedSection>
  )
}

export default WeddingGiftSection
