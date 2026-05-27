import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import DashboardApp from './dashboard/DashboardApp'
import LoginPage from './dashboard/LoginPage'
import InvitationApp from './invitation/InvitationApp'
import FirestoreTestPage from './FirestoreTestPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<InvitationApp />} />
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
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
