import { FormattedMessage, useIntl } from 'react-intl'
import { GALLERY_IMAGES, WEDDING_GIFT } from '../assets'
import AnimatedSection from '../components/AnimatedSection'
import BestWishesForm from '../components/BestWishesForm'
import SectionLabel from '../components/SectionLabel'

function WeddingGiftSection({ onOpenGift, guestId }) {
  const intl = useIntl()

  return (
    <AnimatedSection className="pb-4" page={8}>
      <h3 className="font-chomsky text-4xl leading-none text-stone-900">
        <FormattedMessage id="gift.heading" />
      </h3>

      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        <FormattedMessage id="gift.intro" />
      </p>

      <button
        type="button"
        onClick={onOpenGift}
        className="mt-6 font-serif text-md font-bold uppercase tracking-widest text-stone-800 underline underline-offset-4 transition-colors hover:text-stone-500"
      >
        <FormattedMessage id="gift.button" />
      </button>

      <div className="mt-10">
        <SectionLabel label={intl.formatMessage({ id: 'gift.bestWishes' })} />
      </div>

      <figure className="mt-4 overflow-hidden border border-stone-300">
        <img
          src={WEDDING_GIFT}
          alt={intl.formatMessage({ id: 'common.coupleAlt' })}
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </figure>

      <p className="mt-6 text-sm leading-relaxed text-stone-700">
        <FormattedMessage id="gift.blessing" />
      </p>

      <BestWishesForm guestId={guestId} />
    </AnimatedSection>
  )
}

export default WeddingGiftSection
