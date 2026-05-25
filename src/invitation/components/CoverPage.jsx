import { COVER_IMAGE } from '../assets'

const GROOM_NAME = 'Bagas'
const BRIDE_NAME = 'Dhela'
const WEDDING_DATE = '6 September 2026'
const GUEST_NAME = 'Yth. Sdr. Budi Santoso, M.H.'

function CoverPage({ onOpenInvitation }) {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col bg-stone-100 px-5 text-stone-800 sm:px-8">
      {/* Section 1 — title */}
      <header className="flex shrink-0 items-center justify-center pt-[max(1.75rem,env(safe-area-inset-top))] pb-4 sm:pb-6">
        <p className="font-serif text-[clamp(0.65rem,2.5vw,0.8rem)] uppercase tracking-[0.35em] text-stone-500">
          The Wedding of
        </p>
      </header>

      {/* Section 2 — names, date, photo */}
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 text-center sm:gap-6">
        <div className="w-full space-y-2">
          <h1 className="font-chomsky text-[clamp(2rem,8vw,2.75rem)] leading-none text-stone-900">
            {GROOM_NAME}
            <span className="mx-2 text-[0.65em] text-stone-400">&</span>
            {BRIDE_NAME}
          </h1>
          <p className="font-serif text-[clamp(0.7rem,2.2vw,0.85rem)] uppercase tracking-[0.25em] text-stone-600">
            {WEDDING_DATE}
          </p>
        </div>

        <div className="flex w-full max-w-[min(240px,72vw)] flex-col items-center gap-3">
          <figure className="w-full overflow-hidden border border-stone-200 bg-stone-50 shadow-sm">
            <img
              src={COVER_IMAGE}
              alt={`${GROOM_NAME} and ${BRIDE_NAME}`}
              className="aspect-[4/5] w-full object-cover"
            />
          </figure>
          <p className="w-full px-1 font-serif text-[clamp(0.75rem,2.2vw,0.9rem)] leading-snug text-stone-700">
            {GUEST_NAME}
          </p>
        </div>
      </main>

      {/* Section 3 — open invitation */}
      <footer className="shrink-0 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-4 sm:pt-6">
        <button
          type="button"
          onClick={onOpenInvitation}
          className="w-full border border-stone-800 bg-stone-900 px-6 py-3.5 font-serif text-[clamp(0.7rem,2vw,0.8rem)] uppercase tracking-[0.22em] text-stone-50 transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800 active:bg-stone-950"
        >
          Open the invitation
        </button>
      </footer>
    </div>
  )
}

export default CoverPage
