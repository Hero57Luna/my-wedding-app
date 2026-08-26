import { useState, useCallback } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useAuth } from '../auth/useAuth'
import DashboardNav from './components/DashboardNav'
import DashboardMobileMenu from './components/DashboardMobileMenu'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

const pageTransition = { duration: 0.22, ease: [0.25, 1, 0.5, 1] }

function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = useCallback(async () => {
    await logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  const handleToggle = useCallback(() => setMenuOpen((v) => !v), [])
  const handleClose = useCallback(() => setMenuOpen(false), [])

  return (
    <main className="min-h-screen bg-stone-100 text-stone-800">
      {/* Mobile-only: header bar + drawer */}
      <DashboardMobileMenu
        menuOpen={menuOpen}
        onToggle={handleToggle}
        onClose={handleClose}
        user={user}
        onLogout={handleLogout}
      />

      <div className="mx-auto flex min-h-screen max-w-[110rem] flex-col gap-8 px-5 pt-20 pb-8 sm:flex-row sm:px-8 sm:py-10 sm:pt-10">
        {/* Desktop sidebar */}
        <aside className="hidden w-full shrink-0 sm:block sm:w-52">
          <p className="font-serif text-xs uppercase tracking-[0.28em] text-stone-500">
            Wedding Admin
          </p>
          <h1 className="mt-2 font-serif text-2xl text-stone-900">Dashboard</h1>
          {user?.email ? (
            <p className="mt-2 text-xs text-stone-500">{user.email}</p>
          ) : null}
          <div className="mt-6">
            <DashboardNav />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 w-full rounded-md border border-stone-300 bg-white px-3 py-2 font-serif text-xs uppercase tracking-[0.15em] text-stone-700 transition hover:bg-stone-50 sm:w-auto"
          >
            Sign out
          </button>
        </aside>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-w-0 flex-1"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

export default DashboardLayout
