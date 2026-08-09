import CopyCard from './CopyCard'

function BankAccountCard({ name, bankName, accountNumber, accountHolder }) {
  return (
    <CopyCard copyValue={accountNumber}>
      <div className="flex items-start justify-between">
        <div className="h-8 w-11 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-500" />
        <div className="text-right">
          <p className="font-serif text-sm font-bold uppercase tracking-widest text-stone-700">
            {bankName}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-stone-500">{name}</p>
        </div>
      </div>

      <p className="mt-6 font-mono text-lg tracking-widest text-stone-900">{accountNumber}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-stone-600">{accountHolder}</p>
    </CopyCard>
  )
}

export default BankAccountCard
