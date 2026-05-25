import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import DashboardNav from './components/DashboardNav'

function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-stone-100 text-stone-800">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-5 py-8 sm:flex-row sm:px-8 sm:py-10">
        <aside className="w-full shrink-0 sm:w-52">
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

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default DashboardLayout
