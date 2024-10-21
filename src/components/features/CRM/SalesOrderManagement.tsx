import React, { useState } from 'react';
import { Package, DollarSign, TrendingUp, RefreshCcw, BarChart } from 'lucide-react';
import SalesOrderCreation from './SalesOrderManagement/SalesOrderCreation';
import OrderFulfillment from './SalesOrderManagement/OrderFulfillment';
import ReturnsRefunds from './SalesOrderManagement/ReturnsRefunds';
import PricingManagement from './SalesOrderManagement/PricingManagement';
import SalesAnalytics from './SalesOrderManagement/SalesAnalytics';

const SalesOrderManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('salesOrder');

  const tabs = [
    { id: 'salesOrder', name: 'Sales Order Creation', icon: <Package /> },
    { id: 'fulfillment', name: 'Order Fulfillment', icon: <DollarSign /> },
    { id: 'returns', name: 'Returns and Refunds', icon: <RefreshCcw /> },
    { id: 'pricing', name: 'Pricing Management', icon: <TrendingUp /> },
    { id: 'analytics', name: 'Sales Analytics', icon: <BarChart /> },
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case 'salesOrder':
        return <SalesOrderCreation />;
      case 'fulfillment':
        return <OrderFulfillment />;
      case 'returns':
        return <ReturnsRefunds />;
      case 'pricing':
        return <PricingManagement />;
      case 'analytics':
        return <SalesAnalytics />;
      default:
        return <SalesOrderCreation />;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Sales and Order Management</h2>
      <div className="flex mb-6 space-x-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span className="ml-2">{tab.name}</span>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {renderComponent()}
      </div>
    </div>
  );
};

export default SalesOrderManagement;