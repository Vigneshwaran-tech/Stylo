import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import type { Booking } from '../services/firestoreService';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const bookingsRef = collection(db, 'bookings');
        let q = query(bookingsRef, orderBy('createdAt', 'desc'));
        
        if (filter !== 'all') {
          q = query(bookingsRef, where('status', '==', filter), orderBy('createdAt', 'desc'));
        }
        
        const snapshot = await getDocs(q);
        const fetchedBookings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Booking));
        
        setBookings(fetchedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [filter]);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#f8b646', margin: 0 }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ color: '#a5acba' }}>{user?.email}</span>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2a303a',
              color: '#f8b646',
              border: '1px solid #f8b646',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#1f232d', padding: '20px', borderRadius: '8px', border: '1px solid #2a303a' }}>
          <div style={{ color: '#a5acba', fontSize: '14px', marginBottom: '8px' }}>Total Bookings</div>
          <div style={{ color: '#f8b646', fontSize: '32px', fontWeight: 'bold' }}>{stats.total}</div>
        </div>
        <div style={{ backgroundColor: '#1f232d', padding: '20px', borderRadius: '8px', border: '1px solid #2a303a' }}>
          <div style={{ color: '#a5acba', fontSize: '14px', marginBottom: '8px' }}>Confirmed</div>
          <div style={{ color: '#4ade80', fontSize: '32px', fontWeight: 'bold' }}>{stats.confirmed}</div>
        </div>
        <div style={{ backgroundColor: '#1f232d', padding: '20px', borderRadius: '8px', border: '1px solid #2a303a' }}>
          <div style={{ color: '#a5acba', fontSize: '14px', marginBottom: '8px' }}>Completed</div>
          <div style={{ color: '#60a5fa', fontSize: '32px', fontWeight: 'bold' }}>{stats.completed}</div>
        </div>
        <div style={{ backgroundColor: '#1f232d', padding: '20px', borderRadius: '8px', border: '1px solid #2a303a' }}>
          <div style={{ color: '#a5acba', fontSize: '14px', marginBottom: '8px' }}>Cancelled</div>
          <div style={{ color: '#ef4444', fontSize: '32px', fontWeight: 'bold' }}>{stats.cancelled}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {(['all', 'confirmed', 'completed', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              backgroundColor: filter === f ? '#f8b646' : '#2a303a',
              color: filter === f ? '#000' : '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div style={{ backgroundColor: '#1f232d', borderRadius: '8px', border: '1px solid #2a303a', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#2a303a' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#f8b646' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#f8b646' }}>Time</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#f8b646' }}>User ID</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#f8b646' }}>Shop ID</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#f8b646' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#a5acba' }}>
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#a5acba' }}>
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} style={{ borderBottom: '1px solid #2a303a' }}>
                  <td style={{ padding: '12px', color: '#fff' }}>{booking.date}</td>
                  <td style={{ padding: '12px', color: '#fff' }}>{booking.time}</td>
                  <td style={{ padding: '12px', color: '#a5acba', fontSize: '12px' }}>
                    {booking.userId.substring(0, 8)}...
                  </td>
                  <td style={{ padding: '12px', color: '#a5acba', fontSize: '12px' }}>
                    {booking.shopId.substring(0, 8)}...
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor:
                          booking.status === 'confirmed' ? '#4ade8033' :
                          booking.status === 'completed' ? '#60a5fa33' :
                          '#ef444433',
                        color:
                          booking.status === 'confirmed' ? '#4ade80' :
                          booking.status === 'completed' ? '#60a5fa' :
                          '#ef4444',
                      }}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
