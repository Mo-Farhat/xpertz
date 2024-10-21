import React, { useState } from 'react';
import { FileText, Calendar, Clipboard, Activity, CheckSquare, Package } from 'lucide-react';
import BillOfMaterials from './Manufacturing/BillOfMaterials';
import ProductionPlanning from './Manufacturing/ProductionPlanning';
import WorkOrderManagement from './Manufacturing/WorkOrderManagement';
import ShopFloorControl from './Manufacturing/ShopFloorControl';
import QualityControl from './Manufacturing/QualityControl';
import MaterialsRequirementPlanning from './Manufacturing/MaterialsRequirementPlanning';

const Manufacturing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bom');

  const tabs = [
    { id: 'bom', name: 'Bill of Materials', icon: <FileText /> },
    { id: 'planning', name: 'Production Planning', icon: <Calendar /> },
    { id: 'workOrder', name: 'Work Order Management', icon: <Clipboard /> },
    { id: 'shopFloor', name: 'Shop Floor Control', icon: <Activity /> },
    { id: 'quality', name: 'Quality Control', icon: <CheckSquare /> },
    { id: 'mrp', name: 'Materials Requirement Planning', icon: <Package /> },
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case 'bom':
        return <BillOfMaterials />;
      case 'planning':
        return <ProductionPlanning />;
      case 'workOrder':
        return <WorkOrderManagement />;
      case 'shopFloor':
        return <ShopFloorControl />;
      case 'quality':
        return <QualityControl />;
      case 'mrp':
        return <MaterialsRequirementPlanning />;
      default:
        return <BillOfMaterials />;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Manufacturing/Production Management</h2>
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

export default Manufacturing;