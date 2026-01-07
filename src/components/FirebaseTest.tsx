import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const FirebaseTest: React.FC = () => {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string>('Testing Firebase...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test 1: Check if Firestore is accessible
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        
        setTestResult('✅ Firebase Connected Successfully!');
        console.log('✅ Firebase & Firestore are working!');
      } catch (err: any) {
        console.error('❌ Firebase Error:', err);
        setError(err.message);
        setTestResult('❌ Firebase Connection Failed');
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="firebase-test-container">
      <h2>🧪 Firebase Test</h2>
      <p><strong>Auth User:</strong> {user ? `${user.email}` : 'Not logged in'}</p>
      <p><strong>Status:</strong> {testResult}</p>
      {error && <p className="firebase-test-error"><strong>Error:</strong> {error}</p>}
      <p className="firebase-test-info">Check browser console for detailed logs</p>
    </div>
  );
};
