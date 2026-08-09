import CopyCard from './CopyCard'

function ShippingAddressCard({ recipient, address }) {
  return (
    <CopyCard copyValue={`${recipient}\n${address}`}>
      <p className="font-serif text-base font-bold text-stone-900">Send a Gift</p>
      <p className="mt-4 text-xs uppercase tracking-wide text-stone-500">Recipient</p>
      <p className="mt-1 text-sm font-bold text-stone-800">{recipient}</p>
      <p className="mt-3 text-xs uppercase tracking-wide text-stone-500">Address</p>
      <p className="mt-1 text-sm leading-relaxed text-stone-700">{address}</p>
    </CopyCard>
  )
}

export default ShippingAddressCard
