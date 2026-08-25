import CopyCard from './CopyCard'

function BankAccountCard({ name, bankName, bankLogo, accountNumber, accountHolder }) {
  return (
    <CopyCard copyValue={accountNumber}>
      <div className="relative flex h-8 items-center justify-between">
        <div className="h-8 w-11 shrink-0 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-500" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-right">
          {bankLogo ? (
            <img
              src={bankLogo}
              alt={bankName}
              className="ml-auto h-6 w-auto object-contain"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <>
              <p className="font-serif text-sm font-bold uppercase tracking-widest text-stone-700">
                {bankName}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-stone-500">{name}</p>
            </>
          )}
        </div>
      </div>

      <p className="mt-6 font-mono text-lg tracking-widest text-stone-900">{accountNumber}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-stone-600">{accountHolder}</p>
    </CopyCard>
  )
}

export default BankAccountCard
