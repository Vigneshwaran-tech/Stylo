import React from 'react'
import type { Shop, Booking } from '../../services/firestoreService'

interface DashboardProps {
  shops?: Shop[]
  bookings?: Booking[]
}

export const AdminDashboardPage: React.FC<DashboardProps> = () => {
  return (
    <div className="admin-grid">
      <div className="admin-card">
        <p className="admin-label">Overview</p>
        <h2 className="admin-title">Dashboard</h2>
        <p className="admin-subtext">Stub dashboard — wire real data later.</p>
      </div>
      <div className="admin-card">
        <p className="admin-label">Next step</p>
        <p className="admin-subtext">Hook Firestore admin queries here.</p>
      </div>
    </div>
  )
}

export default AdminDashboardPage
