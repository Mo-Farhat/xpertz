import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { 
  MessageSquare, Calendar, Clock, CheckSquare, BookOpen, Users,
  Briefcase, BarChart2, PieChart, ShoppingCart, Percent, CheckCircle,
  Clock as ClockIcon, Trello, FileText, ShoppingBag, Box, Factory,
  Truck, Barcode, Edit3, UserPlus, DollarSign, Grid
} from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  { id: 'discuss', name: 'Discuss', icon: <MessageSquare /> },
  { id: 'calendar', name: 'Calendar', icon: <Calendar /> },
  { id: 'appointments', name: 'Appointments', icon: <Clock /> },
  { id: 'todo', name: 'To-do', icon: <CheckSquare /> },
  { id: 'knowledge', name: 'Knowledge', icon: <BookOpen /> },
  { id: 'contacts', name: 'Contacts', icon: <Users /> },
  { id: 'crm', name: 'CRM', icon: <Briefcase /> },
  { id: 'sales', name: 'Sales', icon: <BarChart2 /> },
  { id: 'dashboards', name: 'Dashboards', icon: <PieChart /> },
  { id: 'pos', name: 'Point of Sale', icon: <ShoppingCart /> },
  { id: 'accounting', name: 'Accounting', icon: <Percent /> },
  { id: 'project', name: 'Project', icon: <CheckCircle /> },
  { id: 'timesheets', name: 'Timesheets', icon: <ClockIcon /> },
  { id: 'planning', name: 'Planning', icon: <Trello /> },
  { id: 'surveys', name: 'Surveys', icon: <FileText /> },
  { id: 'purchase', name: 'Purchase', icon: <ShoppingBag /> },
  { id: 'inventory', name: 'Inventory', icon: <Box /> },
  { id: 'manufacturing', name: 'Manufacturing', icon: <Factory /> },
  { id: 'shopfloor', name: 'Shop Floor', icon: <Truck /> },
  { id: 'barcode', name: 'Barcode', icon: <Barcode /> },
  { id: 'sign', name: 'Sign', icon: <Edit3 /> },
  { id: 'employees', name: 'Employees', icon: <UserPlus /> },
  { id: 'expenses', name: 'Expenses', icon: <DollarSign /> },
  { id: 'apps', name: 'Apps', icon: <Grid /> },
];

const FeatureManagement: React.FC = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { setSubscriptionPlan } = useTenant();

  useEffect(() => {
    const fetchUserFeatures = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setSelectedFeatures(userDoc.data().selectedFeatures || []);
          }
        } catch (error) {
          setError('Failed to fetch user features');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserFeatures();
  }, [user]);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSaveFeatures = async () => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          selectedFeatures,
        });
        // Update subscription plan based on the number of selected features
        const newPlan = selectedFeatures.length <= 5 ? 'basic' : selectedFeatures.length <= 15 ? 'professional' : 'enterprise';
        await updateDoc(doc(db, 'users', user.uid), { subscriptionPlan: newPlan });
        setSubscriptionPlan(newPlan);
        setError('Features updated successfully');
      } catch (error) {
        setError('Failed to update features');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Features</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
              selectedFeatures.includes(feature.id)
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => toggleFeature(feature.id)}
          >
            <div className="text-3xl mb-2">{feature.icon}</div>
            <span className="text-xs text-center">{feature.name}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleSaveFeatures}
        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
      >
        Save Changes
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default FeatureManagement;