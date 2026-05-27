import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase/config'
import { AuthContext } from './authContext'
import { getFirebaseAuthErrorMessage } from './firebaseErrors'

const SESSION_DURATION_MS = 5 * 60 * 60 * 1000 // 24 hours
const SESSION_LOGIN_AT_KEY = 'dashboard_login_at'

function recordLoginTime() {
  localStorage.setItem(SESSION_LOGIN_AT_KEY, String(Date.now()))
}

function clearLoginTime() {
  localStorage.removeItem(SESSION_LOGIN_AT_KEY)
}

function isSessionExpired() {
  const loginAt = localStorage.getItem(SESSION_LOGIN_AT_KEY)
  if (!loginAt) return true
  return Date.now() - Number(loginAt) > SESSION_DURATION_MS
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && isSessionExpired()) {
        signOut(auth)
        clearLoginTime()
        setUser(null)
        setIsLoading(false)
        return
      }
      setUser(firebaseUser)
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      recordLoginTime()
      await signInWithEmailAndPassword(auth, email, password)
      return { ok: true }
    } catch (error) {
      clearLoginTime()
      return { ok: false, error: getFirebaseAuthErrorMessage(error) }
    }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider()
      recordLoginTime()
      await signInWithPopup(auth, provider)
      return { ok: true }
    } catch (error) {
      clearLoginTime()
      if (error.code === 'auth/popup-closed-by-user') return { ok: false, error: null }
      return { ok: false, error: getFirebaseAuthErrorMessage(error) }
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
    clearLoginTime()
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      loginWithGoogle,
      logout,
    }),
    [user, isLoading, login, loginWithGoogle, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
