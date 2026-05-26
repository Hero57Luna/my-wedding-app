import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

function LoginPage() {
  const { isAuthenticated, isLoading, login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

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

  const handleGoogleSignIn = async () => {
    setError('')
    setIsGoogleSubmitting(true)
    const result = await loginWithGoogle()
    setIsGoogleSubmitting(false)

    if (!result.ok) {
      if (result.error) setError(result.error)
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
            disabled={isSubmitting || isGoogleSubmitting || isLoading}
            className="w-full rounded-md border border-stone-800 bg-stone-900 px-4 py-3 font-serif text-xs uppercase tracking-[0.2em] text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-stone-200" />
            <span className="font-serif text-xs uppercase tracking-[0.15em] text-stone-400">
              or
            </span>
            <span className="h-px flex-1 bg-stone-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isGoogleSubmitting || isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isGoogleSubmitting ? 'Signing in…' : 'Sign in with Google'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default LoginPage
