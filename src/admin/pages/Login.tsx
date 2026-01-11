import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export const AdminLogin: React.FC = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@barbershop.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      window.location.href = '/admin/dashboard'
    } catch (err) {
      setError('Failed to login. Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <header className="admin-login-topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden />
          <div>
            <p className="brand-name">The Barber Shop</p>
            <p className="brand-tag">Admin Console</p>
          </div>
        </div>
        <a className="ghost-link" href="/">Go to Website</a>
      </header>

      <div className="admin-login-shell">
        <div className="admin-login-card">
          <div className="login-icon" aria-hidden>🔒</div>
          <h1 className="login-title">Admin Login</h1>
          <p className="login-sub">Manage your shop bookings and slots</p>

          <form onSubmit={handleSubmit} className="login-form">
            <label>Email Address</label>
            <div className="input-wrap">
              <span className="input-icon">📧</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="admin@barbershop.com"
                required
              />
            </div>

            <label>Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔑</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <p className="admin-error">{error}</p>}

            <button className="primary" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <p className="tiny-text">Only authorized staff can access this panel</p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
