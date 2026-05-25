function SummaryCard({ label, value, hint, accent = 'stone' }) {
  const accentClasses = {
    stone: 'border-stone-200 text-stone-900',
    emerald: 'border-emerald-200 text-emerald-900',
    amber: 'border-amber-200 text-amber-900',
    slate: 'border-slate-200 text-slate-700',
  }

  return (
    <article
      className={`rounded-lg border bg-white p-5 shadow-sm ${accentClasses[accent] ?? accentClasses.stone}`}
    >
      <p className="font-serif text-xs uppercase tracking-[0.2em] text-stone-500">
        {label}
      </p>
      <p className="mt-3 font-serif text-4xl tabular-nums">{value}</p>
      {hint ? <p className="mt-2 text-sm text-stone-600">{hint}</p> : null}
    </article>
  )
}

export default SummaryCard
