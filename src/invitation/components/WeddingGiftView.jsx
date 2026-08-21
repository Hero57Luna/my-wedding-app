import { FormattedMessage, useIntl } from 'react-intl'
import { GIFT_ACCOUNTS, GIFT_SHIPPING_ADDRESS } from '../assets'
import BankAccountCard from './BankAccountCard'
import GiftConfirmationForm from './GiftConfirmationForm'
import SectionLabel from './SectionLabel'
import ShippingAddressCard from './ShippingAddressCard'

function WeddingGiftView({ onClose }) {
  const intl = useIntl()

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-white">
      <div className="mx-auto min-h-[100dvh] w-full max-w-lg border-x border-stone-300/80 bg-white px-5 py-6 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-chomsky text-3xl leading-none text-stone-900">
            <FormattedMessage id="gift.heading" />
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={intl.formatMessage({ id: 'giftView.close' })}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-300 text-stone-700 transition hover:bg-stone-100"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="mt-3">
          <SectionLabel label={intl.formatMessage({ id: 'giftView.label' })} />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-stone-600">
          <FormattedMessage id="giftView.intro" />
        </p>

        <div className="mt-6 space-y-4">
          <BankAccountCard
            name={GIFT_ACCOUNTS.groom.name}
            bankName={GIFT_ACCOUNTS.groom.bankName}
            accountNumber={GIFT_ACCOUNTS.groom.accountNumber}
            accountHolder={GIFT_ACCOUNTS.groom.accountHolder}
          />
          <BankAccountCard
            name={GIFT_ACCOUNTS.bride.name}
            bankName={GIFT_ACCOUNTS.bride.bankName}
            accountNumber={GIFT_ACCOUNTS.bride.accountNumber}
            accountHolder={GIFT_ACCOUNTS.bride.accountHolder}
          />
        </div>

        <div className="mt-4">
          <ShippingAddressCard
            recipient={GIFT_SHIPPING_ADDRESS.recipient}
            address={GIFT_SHIPPING_ADDRESS.address}
          />
        </div>

        <div className="mt-8">
          <GiftConfirmationForm />
        </div>
      </div>
    </div>
  )
}

export default WeddingGiftView
