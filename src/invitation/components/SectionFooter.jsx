function SectionFooter({ page }) {
  return (
    <footer className="mt-8 w-full border-t border-stone-300 pt-5">
      <p className="text-center font-serif text-xs uppercase tracking-[0.28em] text-stone-500">
        Page {page}
      </p>
    </footer>
  )
}

export default SectionFooter
