import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import InvitationGate from './invitation/InvitationGate'

const DashboardApp = lazy(() => import('./dashboard/DashboardApp'))
const LoginPage = lazy(() => import('./dashboard/LoginPage'))
const FirestoreTestPage = lazy(() => import('./FirestoreTestPage'))

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<InvitationGate />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/test" element={<FirestoreTestPage />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardApp />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
