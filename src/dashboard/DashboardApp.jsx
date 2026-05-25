import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

function DashboardApp() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-stone-100 text-stone-800">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-300 pb-6">
          <div>
            <p className="font-serif text-xs uppercase tracking-[0.28em] text-stone-500">
              Wedding Admin
            </p>
            <h1 className="mt-2 font-serif text-3xl text-stone-900">
              Guest Arrival Dashboard
            </h1>
            <p className="mt-2 text-stone-600">
              Record and manage guests as they arrive at the venue.
            </p>
            {user?.email ? (
              <p className="mt-1 text-sm text-stone-500">Signed in as {user.email}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-stone-300 bg-white px-4 py-2 font-serif text-xs uppercase tracking-[0.15em] text-stone-700 transition hover:bg-stone-50"
          >
            Sign out
          </button>
        </header>

        <section className="mt-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-stone-600">
            Dashboard features (check-in form, guest list, search) will be
            built here.
          </p>
        </section>
      </div>
    </main>
  )
}

export default DashboardApp
