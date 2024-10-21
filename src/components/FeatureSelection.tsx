import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, Briefcase, BarChart2, PieChart, ShoppingCart, Percent, CheckCircle,
  Clock as ClockIcon, Trello, ShoppingBag, Box, Factory,
  UserPlus, DollarSign
} from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  { id: 'calendar', name: 'Calendar', icon: <Calendar /> },
  { id: 'contacts', name: 'Contacts', icon: <Users /> },
  { id: 'crm', name: 'CRM', icon: <Briefcase /> },
  { id: 'sales', name: 'Sales', icon: <BarChart2 /> },
  { id: 'dashboards', name: 'Dashboards', icon: <PieChart /> },
  { id: 'pos', name: 'Point of Sale', icon: <ShoppingCart /> },
  { id: 'finance_accounting', name: 'Finance & Accounting', icon: <Percent /> },
  { id: 'project', name: 'Project', icon: <CheckCircle /> },
  { id: 'timesheets', name: 'Timesheets', icon: <ClockIcon /> },
  { id: 'planning', name: 'Planning', icon: <Trello /> },
  { id: 'purchase', name: 'Purchase', icon: <ShoppingBag /> },
  { id: 'inventory', name: 'Inventory', icon: <Box /> },
  { id: 'manufacturing', name: 'Manufacturing', icon: <Factory /> },
  { id: 'hr_management', name: 'HR Management', icon: <UserPlus /> },
  { id: 'expenses', name: 'Expenses', icon: <DollarSign /> },
];

const FeatureSelection: React.FC = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleContinue = () => {
    navigate('/login', { state: { selectedFeatures } });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold mb-6 text-center">Select Your Features</h1>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
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
          <div className="mt-8 flex justify-center">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSelection;