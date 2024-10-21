import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Users, Briefcase, BarChart2, PieChart, ShoppingCart, Percent, CheckCircle,
  Clock, Trello, FileText, ShoppingBag, Box, Factory, UserPlus, DollarSign
} from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
}

const features: Feature[] = [
  { id: 'calendar', name: 'Calendar', icon: <Calendar />, path: '/calendar' },
  { id: 'contacts', name: 'Contacts', icon: <Users />, path: '/contacts' },
  { id: 'crm', name: 'CRM', icon: <Briefcase />, path: '/crm' },
  { id: 'sales', name: 'Sales', icon: <BarChart2 />, path: '/sales' },
  { id: 'dashboards', name: 'Dashboards', icon: <PieChart />, path: '/dashboard' },
  { id: 'pos', name: 'Point of Sale', icon: <ShoppingCart />, path: '/point-of-sale' },
  { id: 'finance_accounting', name: 'Finance & Accounting', icon: <Percent />, path: '/finance-and-accounting' },
  { id: 'project', name: 'Project', icon: <CheckCircle />, path: '/project' },
  { id: 'timesheets', name: 'Timesheets', icon: <Clock />, path: '/timesheets' },
  { id: 'planning', name: 'Planning', icon: <Trello />, path: '/planning' },
  { id: 'purchase', name: 'Purchase', icon: <ShoppingBag />, path: '/purchase' },
  { id: 'inventory', name: 'Inventory', icon: <Box />, path: '/inventory' },
  { id: 'manufacturing', name: 'Manufacturing', icon: <Factory />, path: '/manufacturing' },
  { id: 'hr_management', name: 'HR Management', icon: <UserPlus />, path: '/hr-management' },
  { id: 'expenses', name: 'Expenses', icon: <DollarSign />, path: '/expenses' },
  { id: 'reports', name: 'Reports', icon: <FileText />, path: '/reports' },
];

const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold mb-6 text-center">Available Features</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {features.map((feature) => (
              <Link
                key={feature.id}
                to={feature.path}
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <span className="text-xs text-center">{feature.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;