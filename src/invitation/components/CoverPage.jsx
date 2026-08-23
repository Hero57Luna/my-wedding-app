import { FormattedMessage, useIntl } from 'react-intl'
import { COVER_IMAGE } from '../assets'

const GROOM_NAME = 'Bagas'
const BRIDE_NAME = 'Dhela'

function CoverPage({ guestName, onOpenInvitation }) {
  const intl = useIntl()

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col bg-white px-5 text-stone-900 sm:px-8">
      {/* Section 1 — headline */}
      <header className="shrink-0 pt-[max(1.75rem,env(safe-area-inset-top))] pb-4 sm:pb-6">
        <h1 className="text-center font-chomsky text-[clamp(2.25rem,10vw,4rem)] leading-none text-stone-900">
          <FormattedMessage id="cover.title" />
        </h1>
        <div className="mt-4 flex items-center justify-between border-t border-stone-800 pt-2 font-serif text-[clamp(0.75rem,2.4vw,0.9rem)] text-stone-700">
          <p>
            <FormattedMessage
              id="cover.couple"
              values={{ groom: GROOM_NAME, bride: BRIDE_NAME }}
            />
          </p>
          <p>
            <FormattedMessage id="cover.date" />
          </p>
        </div>
      </header>

      {/* Section 2 — photo, greeting */}
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 text-center">
        <figure className="w-full overflow-hidden border border-stone-300 bg-stone-50">
          <img
            src={COVER_IMAGE}
            alt={intl.formatMessage({ id: 'common.coupleAlt' })}
            className="aspect-[4/5] w-full object-cover"
          />
        </figure>

        <div className="space-y-2">
          <p className="font-serif text-sm text-stone-700">
            <FormattedMessage id="cover.dear" />
          </p>
          <p className="font-serif text-lg font-bold text-stone-900">
            {guestName || <FormattedMessage id="common.familyFriends" />}
          </p>
        </div>
      </main>

      {/* Section 3 — open invitation */}
      <footer className="shrink-0 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-4 sm:pt-6">
        <button
          type="button"
          onClick={onOpenInvitation}
          className="w-full border border-stone-900 bg-transparent px-6 py-3.5 font-serif text-[clamp(0.7rem,2vw,0.8rem)] uppercase tracking-[0.22em] text-stone-900 transition-colors hover:bg-stone-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800"
        >
          <FormattedMessage id="cover.openInvitation" />
        </button>
      </footer>
    </div>
  )
}

export default CoverPage
