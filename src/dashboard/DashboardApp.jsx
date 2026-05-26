import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './DashboardLayout'
import GuestsPage from './pages/GuestsPage'
import HomePage from './pages/HomePage'

function DashboardApp() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="guests" element={<GuestsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default DashboardApp
