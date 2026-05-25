import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectPath = location.state?.from?.pathname ?? '/dashboard'

  if (!isLoading && isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = await login(email.trim(), password)
    setIsSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    navigate(redirectPath, { replace: true })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-5 text-stone-800">
      <div className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <header className="border-b border-stone-200 pb-5">
          <p className="font-serif text-xs uppercase tracking-[0.28em] text-stone-500">
            Wedding Admin
          </p>
          <h1 className="mt-2 font-serif text-2xl text-stone-900">Sign in</h1>
          <p className="mt-2 text-sm text-stone-600">
            Sign in to access the guest arrival dashboard.
          </p>
        </header>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block font-serif text-xs uppercase tracking-[0.15em] text-stone-600"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-serif text-xs uppercase tracking-[0.15em] text-stone-600"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
            />
          </div>

          {error ? (
            <p
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full rounded-md border border-stone-800 bg-stone-900 px-4 py-3 font-serif text-xs uppercase tracking-[0.2em] text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default LoginPage
