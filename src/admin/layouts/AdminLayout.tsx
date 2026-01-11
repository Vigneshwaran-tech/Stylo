import React from 'react'
import './admin.css'

interface AdminLayoutProps {
  title?: string
  children: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ title = 'Admin', children }) => {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">Stylo Admin</div>
        <nav className="admin-nav">
          <a href="/admin/dashboard">Dashboard</a>
        </nav>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-label">Admin</p>
            <h1 className="admin-title">{title}</h1>
          </div>
          <a className="admin-link" href="/">Go to Website</a>
        </header>
        <section className="admin-content">{children}</section>
      </main>
    </div>
  )
}

export default AdminLayout
