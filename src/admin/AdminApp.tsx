import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import AdminLayout from './layouts/AdminLayout'
import AdminLogin from './pages/Login'
import AdminDashboardPage from './pages/Dashboard'

const getAdminRoute = (path: string) => {
  if (!path.startsWith('/admin')) return 'dashboard'
  const [, , rest] = path.split('/')
  return rest || 'login'
}

export const AdminApp: React.FC = () => {
  const { user } = useAuth()
  const path = typeof window !== 'undefined' ? window.location.pathname : '/admin/login'
  const route = getAdminRoute(path)

  // Show admin login if on /admin/login route (always accessible)
  if (route === 'login') {
    return <AdminLogin />
  }

  // Require auth for other admin routes
  if (!user) {
    window.location.href = '/admin/login'
    return <AdminLogin />
  }

  return (
    <AdminLayout title="Dashboard">
      {route === 'dashboard' && <AdminDashboardPage />}
    </AdminLayout>
  )
}

export default AdminApp
