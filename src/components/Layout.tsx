import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Calendar, Users, Briefcase, DollarSign, ShoppingCart, Percent,
  CheckCircle, Clock, Trello, ShoppingBag, Box, Truck, Factory, UserPlus,
  BarChart, Settings, LogOut, User, CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const navItems: NavItem[] = [
  { to: "/dashboard", icon: <Home />, text: "Dashboard" },
  { to: "/calendar", icon: <Calendar />, text: "Calendar" },
  { to: "/contacts", icon: <Users />, text: "Contacts" },
  { to: "/crm", icon: <Briefcase />, text: "CRM" },
  { to: "/sales", icon: <DollarSign />, text: "Sales" },
  { to: "/point-of-sale", icon: <ShoppingCart />, text: "Point of Sale" },
  { to: "/finance-and-accounting", icon: <Percent />, text: "Finance & Accounting" },
  { to: "/project", icon: <CheckCircle />, text: "Project" },
  { to: "/timesheets", icon: <Clock />, text: "Timesheets" },
  { to: "/planning", icon: <Trello />, text: "Planning" },
  { to: "/purchase", icon: <ShoppingBag />, text: "Purchase" },
  { to: "/inventory", icon: <Box />, text: "Inventory" },
  { to: "/inventory-supply-chain", icon: <Truck />, text: "Supply Chain" },
  { to: "/manufacturing", icon: <Factory />, text: "Manufacturing" },
  { to: "/hr-management", icon: <UserPlus />, text: "HR Management" },
  { to: "/hire-purchase", icon: <CreditCard />, text: "Hire Purchase" },
  { to: "/expenses", icon: <DollarSign />, text: "Expenses" },
  { to: "/reports", icon: <BarChart />, text: "Reports" },
  { to: "/user-management", icon: <Settings />, text: "Settings" },
  { to: "/profile", icon: <User />, text: "Profile" },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <motion.nav
        className="bg-blue-800 text-white shadow-lg overflow-hidden transition-all duration-200 ease-in-out flex flex-col"
        initial={false}
        animate={{ width: isExpanded ? '256px' : '64px' }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="p-4 flex-shrink-0">
          <AnimatePresence>
            {isExpanded && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-bold text-center"
              >
                ERP System
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
        <ul className="space-y-2 mt-6 flex-grow overflow-y-auto scrollbar-hide hover:scrollbar-default">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} isActive={location.pathname === item.to} isExpanded={isExpanded} />
          ))}
        </ul>
        <div className="p-4 mt-auto border-t border-blue-700">
          <button onClick={handleLogout} className="flex items-center p-2 text-white hover:bg-blue-700 rounded transition-all duration-200 ease-in-out w-full">
            <LogOut size={20} className="mr-2" />
            {isExpanded && <span className="transition-opacity duration-200 ease-in-out">Logout</span>}
          </button>
        </div>
      </motion.nav>
      <main className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const NavItem: React.FC<NavItem & { isActive: boolean; isExpanded: boolean }> = ({ to, icon, text, isActive, isExpanded }) => (
  <li>
    <Link 
      to={to} 
      className={`flex items-center p-2 rounded transition-all duration-200 ease-in-out
        ${isActive 
          ? 'bg-blue-700 text-white' 
          : 'text-blue-100 hover:bg-blue-700 hover:text-white'
        }`}
    >
      {React.cloneElement(icon as React.ReactElement, { size: 20, className: 'mr-2' })}
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-2 whitespace-nowrap overflow-hidden"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  </li>
);

export default Layout;