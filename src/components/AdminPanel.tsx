import React, { useState } from 'react';
import { seedTestData } from '../services/seedData';
import { generateAndCreateSlots } from '../services/firestoreService';
import { getNext7Days } from '../utils/slotUtils';

export const AdminPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedData = async () => {
    setLoading(true);
    setMessage('Seeding data...');
    try {
      const shopIds = await seedTestData();
      setMessage('✅ Data seeded! Now generating slots...');
      
      // Generate slots for next 7 days for each shop
      const dates = getNext7Days();
      for (const shopId of shopIds) {
        await generateAndCreateSlots(shopId, dates, {
          openTime: '09:00',
          closeTime: '18:00',
          slotDuration: 30,
        });
      }
      
      setMessage('✅ Complete! Shops and slots created successfully!');
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#1f232d',
      padding: '20px',
      borderRadius: '8px',
      border: '2px solid #f8b646',
      zIndex: 1000,
      minWidth: '250px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#f8b646' }}>🔧 Admin Panel</h3>
      <button
        onClick={handleSeedData}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: loading ? '#666' : '#f8b646',
          color: '#000',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}
      >
        {loading ? 'Loading...' : 'Seed Test Data'}
      </button>
      {message && (
        <p style={{
          margin: '10px 0 0 0',
          fontSize: '12px',
          color: message.includes('✅') ? '#4ade80' : message.includes('❌') ? '#ef4444' : '#a5acba'
        }}>
          {message}
        </p>
      )}
    </div>
  );
};
