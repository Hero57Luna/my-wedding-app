function SectionLabel({ label, align = 'left', dark = false }) {
  const textColor = dark ? 'text-stone-300' : 'text-stone-700'
  const ruleColor = dark ? 'border-stone-600' : 'border-stone-800'

  if (align === 'right') {
    return (
      <div className="flex items-center gap-3">
        <span className={`h-px flex-1 ${ruleColor} border-t`} />
        <p className={`shrink-0 font-serif text-sm italic ${textColor}`}>{label}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <p className={`shrink-0 font-serif text-sm italic ${textColor}`}>{label}</p>
      <span className={`h-px flex-1 ${ruleColor} border-t`} />
    </div>
  )
}

export default SectionLabel
