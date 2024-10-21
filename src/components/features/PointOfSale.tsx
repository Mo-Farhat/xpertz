import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, updateDoc, doc, getDoc, increment, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { ShoppingCart, Plus, Minus, Trash2, User, DollarSign, BarChart } from 'lucide-react';
import SalesTransactionManagement from './PointOfSale/SalesTransactionManagement';
import InventoryManagement from './PointOfSale/InventoryManagement';
import CustomerManagement from './PointOfSale/CustomerManagement';
import AccountingIntegration from './PointOfSale/AccountingIntegration';
import EmployeeManagement from './PointOfSale/EmployeeManagement';
import ReportingAnalytics from './PointOfSale/ReportingAnalytics';

const PointOfSale: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sales');

  const renderComponent = () => {
    switch (activeTab) {
      case 'sales':
        return <SalesTransactionManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'accounting':
        return <AccountingIntegration />;
      case 'employees':
        return <EmployeeManagement />;
      case 'reports':
        return <ReportingAnalytics />;
      default:
        return <SalesTransactionManagement />;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Point of Sale</h2>
      <div className="flex mb-4 space-x-2">
        <button onClick={() => setActiveTab('sales')} className={`px-4 py-2 rounded ${activeTab === 'sales' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Sales</button>
        <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded ${activeTab === 'inventory' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Inventory</button>
        <button onClick={() => setActiveTab('customers')} className={`px-4 py-2 rounded ${activeTab === 'customers' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Customers</button>
        <button onClick={() => setActiveTab('accounting')} className={`px-4 py-2 rounded ${activeTab === 'accounting' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Accounting</button>
        <button onClick={() => setActiveTab('employees')} className={`px-4 py-2 rounded ${activeTab === 'employees' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Employees</button>
        <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 rounded ${activeTab === 'reports' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Reports</button>
      </div>
      {renderComponent()}
    </div>
  );
};

export default PointOfSale;