import React, { useState } from 'react';
import { Users, MessageSquare, Mail, FileText } from 'lucide-react';
import LeadManagement from './CRM/LeadManagement';
import CustomerDatabase from './CRM/CustomerDatabase';
import CustomerService from './CRM/CustomerService';
import QuotationsContracts from './CRM/QuotationsContracts';

const CRM: React.FC = () => {
  const [activeTab, setActiveTab] = useState('leads');

  const tabs = [
    { id: 'leads', name: 'Lead Management', icon: <Users /> },
    { id: 'customers', name: 'Customer Database', icon: <Users /> },
    { id: 'service', name: 'Customer Service', icon: <MessageSquare /> },
    { id: 'quotations', name: 'Quotations & Contracts', icon: <FileText /> },
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case 'leads':
        return <LeadManagement />;
      case 'customers':
        return <CustomerDatabase />;
      case 'service':
        return <CustomerService />;
      case 'quotations':
        return <QuotationsContracts />;
      default:
        return <LeadManagement />;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Customer Relationship Management</h2>
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

export default CRM;