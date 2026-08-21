import { FormattedMessage } from 'react-intl'
import CopyCard from './CopyCard'

function ShippingAddressCard({ recipient, address }) {
  return (
    <CopyCard copyValue={`${recipient}\n${address}`}>
      <p className="font-serif text-base font-bold text-stone-900">
        <FormattedMessage id="shipping.title" />
      </p>
      <p className="mt-4 text-xs uppercase tracking-wide text-stone-500">
        <FormattedMessage id="shipping.recipient" />
      </p>
      <p className="mt-1 text-sm font-bold text-stone-800">{recipient}</p>
      <p className="mt-3 text-xs uppercase tracking-wide text-stone-500">
        <FormattedMessage id="shipping.address" />
      </p>
      <p className="mt-1 text-sm leading-relaxed text-stone-700">{address}</p>
    </CopyCard>
  )
}

export default ShippingAddressCard
