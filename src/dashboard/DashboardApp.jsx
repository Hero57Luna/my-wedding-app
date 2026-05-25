import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './DashboardLayout'
import HomePage from './pages/HomePage'

function DashboardApp() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default DashboardApp
