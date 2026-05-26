import { useEffect, useCallback } from 'react'
import DashboardNav from './DashboardNav'

function HamburgerIcon({ open }) {
  return (
    <span className="relative flex h-4 w-5 flex-col items-center justify-between">
      <span
        className={`block h-px w-full origin-center bg-stone-700 transition-all duration-200 ease-out ${
          open ? 'translate-y-[7px] rotate-45' : ''
        }`}
      />
      <span
        className={`block h-px w-full bg-stone-700 transition-all duration-200 ease-out ${
          open ? 'scale-x-0 opacity-0' : ''
        }`}
      />
      <span
        className={`block h-px w-full origin-center bg-stone-700 transition-all duration-200 ease-out ${
          open ? '-translate-y-[9px] -rotate-45' : ''
        }`}
      />
    </span>
  )
}

function DashboardMobileMenu({ menuOpen, onToggle, onClose, user, onLogout }) {
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!menuOpen) return undefined

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen, handleClose])

  return (
    <div className="sm:hidden">
      {/* Fixed mobile header */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-stone-200 bg-stone-50/95 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="" aria-hidden className="h-7 w-7 shrink-0" />
          <span className="font-serif text-xs uppercase tracking-[0.28em] text-stone-500">
            Wedding Admin
          </span>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={menuOpen}
          aria-controls="dashboard-drawer"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 bg-white transition hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500"
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </header>

      {/* Backdrop */}
      <div
        role="presentation"
        onClick={handleClose}
        aria-hidden
        className={`fixed inset-0 z-40 bg-stone-900/40 transition-opacity duration-200 ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer */}
      <aside
        id="dashboard-drawer"
        aria-hidden={!menuOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col border-r border-stone-200 bg-stone-50 shadow-xl transition-transform duration-200 ease-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center gap-3 border-b border-stone-200 px-5 py-4">
          <img src="/favicon.svg" alt="" aria-hidden className="h-8 w-8 shrink-0" />
          <div>
            <p className="font-serif text-[10px] uppercase tracking-[0.28em] text-stone-500">
              Wedding Admin
            </p>
            <p className="font-serif text-lg leading-tight text-stone-900">Dashboard</p>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <DashboardNav onNavigate={handleClose} />
        </div>

        {/* Footer: user info + sign out */}
        <div className="border-t border-stone-200 px-4 py-4">
          {user?.email ? (
            <p className="mb-3 truncate text-xs text-stone-500">{user.email}</p>
          ) : null}
          <button
            type="button"
            onClick={() => {
              handleClose()
              onLogout?.()
            }}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 font-serif text-xs uppercase tracking-[0.15em] text-stone-700 transition hover:bg-stone-50"
          >
            Sign out
          </button>
        </div>
      </aside>
    </div>
  )
}

export default DashboardMobileMenu
