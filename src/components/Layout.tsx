import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Calendar, Users, Briefcase, DollarSign, ShoppingCart, Percent,
  CheckCircle, Clock, Trello, ShoppingBag, Box, Truck, Factory, UserPlus,
  Settings, LogOut, User, CreditCard
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
  roles?: string[];
}

const navItems: NavItem[] = [
  { to: "/dashboard", icon: <Home />, text: "Dashboard" },
  { to: "/contacts", icon: <Users />, text: "Contacts" },
  { to: "/crm", icon: <Briefcase />, text: "CRM" },
  { to: "/point-of-sale", icon: <ShoppingCart />, text: "Point of Sale" },
  { to: "/calendar", icon: <Calendar />, text: "Calendar", roles: ['admin'] },
  { to: "/sales", icon: <DollarSign />, text: "Sales", roles: ['admin', 'accountant'] },
  { to: "/finance-and-accounting", icon: <Percent />, text: "Finance & Accounting", roles: ['admin', 'accountant'] },
  { to: "/project", icon: <CheckCircle />, text: "Project", roles: ['admin'] },
  { to: "/timesheets", icon: <Clock />, text: "Timesheets", roles: ['admin'] },
  { to: "/planning", icon: <Trello />, text: "Planning", roles: ['admin'] },
  { to: "/purchase", icon: <ShoppingBag />, text: "Purchase", roles: ['admin', 'accountant'] },
  { to: "/inventory", icon: <Box />, text: "Inventory", roles: ['admin', 'accountant'] },
  { to: "/inventory-supply-chain", icon: <Truck />, text: "Supply Chain", roles: ['admin', 'accountant'] },
  { to: "/manufacturing", icon: <Factory />, text: "Manufacturing", roles: ['admin', 'accountant'] },
  { to: "/hr-management", icon: <UserPlus />, text: "HR Management", roles: ['admin'] },
  { to: "/hire-purchase", icon: <CreditCard />, text: "Hire Purchase", roles: ['admin', 'accountant'] },
  { to: "/expenses", icon: <DollarSign />, text: "Expenses", roles: ['admin', 'accountant'] },
  { to: "/user-management", icon: <Settings />, text: "Settings", roles: ['admin'] },
  { to: "/profile", icon: <User />, text: "Profile", roles: ['admin'] }
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, setIsIntentionalLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      setIsIntentionalLogout(true);
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || '');
  });

  return (
    <div className="flex h-screen bg-white">
      <motion.nav
        className="overflow-hidden transition-all duration-200 ease-in-out flex flex-col"
        style={{
          backgroundColor: '#000000',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
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
                className="text-2xl font-bold text-center text-white"
              >
                ERP System
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
        <ul className="space-y-2 mt-6 flex-grow overflow-y-auto scrollbar-hide hover:scrollbar-default">
          {filteredNavItems.map((item) => (
            <NavItem key={item.to} {...item} isActive={location.pathname === item.to} isExpanded={isExpanded} />
          ))}
        </ul>
        <div className="p-4 mt-auto border-t border-white/10">
          <button 
            onClick={handleLogout} 
            className="flex items-center p-2 rounded transition-all duration-200 ease-in-out w-full text-white hover:bg-white/10"
          >
            <LogOut size={20} className="mr-2" />
            {isExpanded && <span className="transition-opacity duration-200 ease-in-out">Logout</span>}
          </button>
        </div>
      </motion.nav>
      <main className="flex-1 p-8 overflow-y-auto bg-white">
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
          ? 'bg-red-600 text-white' 
          : 'text-white/90 hover:bg-red-600/20 hover:text-white'
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