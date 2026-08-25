import { useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import AudioToggleButton from './components/AudioToggleButton'
import CoverPage from './components/CoverPage'
import LanguageToggleButton from './components/LanguageToggleButton'
import WeddingGiftView from './components/WeddingGiftView'
import LocaleFade from './i18n/LocaleFade'
import { MAIN_IMAGE, SONG_URL } from './assets'
import BrideSection from './sections/BrideSection'
import CountdownSection from './sections/CountdownSection'
import EventDetailsSection from './sections/EventDetailsSection'
import GallerySection from './sections/GallerySection'
import GroomSection from './sections/GroomSection'
import OurJourneySection from './sections/OurJourneySection'
import OpeningSection from './sections/OpeningSection'
import ThankYouSection from './sections/ThankYouSection'
import WeddingGiftSection from './sections/WeddingGiftSection'

const FADE_MS = 700

function InvitationApp({ guest }) {
  const intl = useIntl()
  const audioRef = useRef(null)
  const userMutedPreferenceRef = useRef(false)
  const pendingCoverRemovalRef = useRef(false)
  const [isMuted, setIsMuted] = useState(false)
  const [coverRemoved, setCoverRemoved] = useState(false)
  const [fadeCoverOut, setFadeCoverOut] = useState(false)
  const [giftOpen, setGiftOpen] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.loop = true
    audio.volume = 0.45
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = isMuted
  }, [isMuted])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        setIsMuted(true)
        return
      }

      setIsMuted(userMutedPreferenceRef.current)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  const handleToggleMute = () => {
    const audio = audioRef.current
    setIsMuted((prev) => {
      const next = !prev
      userMutedPreferenceRef.current = next
      return next
    })
    if (audio) {
      void audio.play()
    }
  }

  const handleOpenInvitation = () => {
    const audio = audioRef.current
    userMutedPreferenceRef.current = false
    setIsMuted(false)
    if (audio) {
      audio.muted = false
      void audio.play()
    }
    pendingCoverRemovalRef.current = true
    setFadeCoverOut(true)
  }

  const handleCoverFadeEnd = (event) => {
    if (event.target !== event.currentTarget) return
    if (event.propertyName !== 'opacity') return
    if (!pendingCoverRemovalRef.current) return
    pendingCoverRemovalRef.current = false
    setCoverRemoved(true)
    setFadeCoverOut(false)
  }

  const invitationActive = fadeCoverOut || coverRemoved

  return (
    <main className="min-h-screen bg-white text-stone-800">
      <audio ref={audioRef} src={SONG_URL} preload="auto" />

      <div
        className={`mx-auto w-full max-w-[1440px] transition-opacity ease-in-out lg:flex ${
          invitationActive
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        style={{ transitionDuration: `${FADE_MS}ms` }}
        aria-hidden={!invitationActive}
      >
        <aside className="relative hidden h-screen w-3/5 lg:block">
          <img
            src={MAIN_IMAGE}
            alt={intl.formatMessage({ id: 'aside.alt' })}
            className="sticky top-0 h-screen w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent" />
          <LocaleFade className="absolute bottom-10 left-10 border-l border-white/70 pl-5 text-white">
            <p className="font-serif text-sm uppercase tracking-[0.25em]">
              <FormattedMessage id="cover.title" />
            </p>
            <h1 className="mt-2 font-chomsky text-4xl tracking-wide">
              Bagas & Dhela
            </h1>
          </LocaleFade>
        </aside>

        <section className="w-full lg:h-screen lg:w-2/5 lg:overflow-y-auto">
          <LocaleFade className="space-y-8 border-x border-stone-300/80 bg-white p-5 sm:p-8 lg:p-10">
            <OpeningSection />
            <GroomSection />
            <BrideSection />
            <CountdownSection />
            <EventDetailsSection receptionTime={guest.time} />
            <OurJourneySection />
            <GallerySection />
            <WeddingGiftSection onOpenGift={() => setGiftOpen(true)} guestId={guest.id} />
            <ThankYouSection />
          </LocaleFade>
        </section>
      </div>

      {!coverRemoved && (
        <div
          className={`fixed inset-0 z-50 overflow-hidden bg-white transition-opacity ease-in-out ${
            fadeCoverOut ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          style={{ transitionDuration: `${FADE_MS}ms` }}
          onTransitionEnd={handleCoverFadeEnd}
        >
          <CoverPage guestName={guest.name} onOpenInvitation={handleOpenInvitation} />
        </div>
      )}

      {invitationActive && (
        <>
          <LanguageToggleButton />
          <AudioToggleButton isMuted={isMuted} onToggle={handleToggleMute} />
        </>
      )}

      {giftOpen && <WeddingGiftView onClose={() => setGiftOpen(false)} />}
    </main>
  )
}

export default InvitationApp
