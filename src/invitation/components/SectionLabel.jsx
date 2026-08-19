function SectionLabel({ label, endLabel, align = 'left', dark = false }) {
  const textColor = dark ? 'text-stone-300' : 'text-stone-700'
  const ruleColor = dark ? 'border-stone-600' : 'border-stone-800'
  const text = (value) => (
    <p className={`shrink-0 font-serif text-sm italic ${textColor}`}>{value}</p>
  )

  const [start, end] = align === 'right' ? [endLabel, label] : [label, endLabel]

  return (
    <div className="flex items-center gap-3">
      {start && text(start)}
      <span className={`h-px flex-1 ${ruleColor} border-t`} />
      {end && text(end)}
    </div>
  )
}

export default SectionLabel
