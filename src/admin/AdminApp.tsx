import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import AdminLayout from './layouts/AdminLayout'
import AdminLogin from './pages/Login'
import AdminDashboardPage from './pages/Dashboard'

const getAdminRoute = (path: string) => {
  if (!path.startsWith('/admin')) return 'dashboard'
  const [, , rest] = path.split('/')
  return rest || 'dashboard'
}

export const AdminApp: React.FC = () => {
  const { user } = useAuth()
  const path = typeof window !== 'undefined' ? window.location.pathname : '/admin'
  const route = getAdminRoute(path)

  // TODO: replace with real admin claim/role guard
  if (!user) {
    return <AdminLogin />
  }

  return (
    <AdminLayout title="Dashboard">
      {route === 'dashboard' && <AdminDashboardPage />}
    </AdminLayout>
  )
}

export default AdminApp
