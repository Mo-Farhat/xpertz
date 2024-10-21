import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import SubscriptionPlans from './SubscriptionPlans';

const UserSettings: React.FC = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentPlan(userData.subscriptionPlan);
            setSelectedFeatures(userData.selectedFeatures || []);
          }
        } catch (error) {
          setError('Failed to fetch user data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleUpdatePlan = async (newPlan: string) => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          subscriptionPlan: newPlan,
        });
        setCurrentPlan(newPlan);
      } catch (error) {
        setError('Failed to update subscription plan');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Settings</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Current Subscription Plan</h3>
        <p className="mb-4">Your current plan: <strong>{currentPlan}</strong></p>
        <h4 className="text-lg font-semibold mb-2">Change Plan</h4>
        <SubscriptionPlans 
          onSelectPlan={handleUpdatePlan} 
          selectedPlan={currentPlan} 
          selectedFeatures={selectedFeatures}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default UserSettings;