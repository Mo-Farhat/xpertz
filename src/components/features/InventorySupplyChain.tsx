import React, { useState } from 'react';
import { Box, TrendingUp, Truck, ShoppingCart, BarChart, Send, Barcode } from 'lucide-react';
import InventoryControl from './InventorySupplyChain/InventoryControl';
import ProcurementVendorManagement from './InventorySupplyChain/ProcurementVendorManagement';
import WarehouseManagement from './InventorySupplyChain/WarehouseManagement';
import OrderManagement from './InventorySupplyChain/OrderManagement';
import DemandForecasting from './InventorySupplyChain/DemandForecasting';
import ShippingLogistics from './InventorySupplyChain/ShippingLogistics';
import BarcodeRFID from './InventorySupplyChain/BarcodeRFID';
import Inventory from './Inventory'; // Make sure this import is correct

const InventorySupplyChain: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [error, setError] = useState<string | null>(null);

  console.log('Active Tab:', activeTab);

  const tabs = [
    { id: 'inventory', name: 'Inventory', icon: <Box /> },
    { id: 'inventoryControl', name: 'Inventory Control', icon: <Box /> },
    { id: 'procurementVendor', name: 'Procurement & Vendor', icon: <TrendingUp /> },
    { id: 'warehouseManagement', name: 'Warehouse Management', icon: <Truck /> },
    { id: 'orderManagement', name: 'Order Management', icon: <ShoppingCart /> },
    { id: 'demandForecasting', name: 'Demand Forecasting', icon: <BarChart /> },
    { id: 'shippingLogistics', name: 'Shipping & Logistics', icon: <Send /> },
    { id: 'barcodeRFID', name: 'Barcode/RFID', icon: <Barcode /> },
  ];

  const renderComponent = () => {
    try {
      console.log('Rendering component for tab:', activeTab);
      switch (activeTab) {
        case 'inventory':
          return <Inventory />;
        case 'inventoryControl':
          return <InventoryControl />;
        case 'procurementVendor':
          return <ProcurementVendorManagement />;
        case 'warehouseManagement':
          return <WarehouseManagement />;
        case 'orderManagement':
          return <OrderManagement />;
        case 'demandForecasting':
          return <DemandForecasting />;
        case 'shippingLogistics':
          return <ShippingLogistics />;
        case 'barcodeRFID':
          return <BarcodeRFID />;
        default:
          return <Inventory />;
      }
    } catch (err) {
      console.error('Error rendering component:', err);
      setError('An error occurred while rendering the component. Please try again.');
      return null;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Inventory & Supply Chain Management</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="text-3xl mb-2">{tab.icon}</div>
            <span className="text-sm text-center">{tab.name}</span>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          renderComponent()
        )}
      </div>
    </div>
  );
};

export default InventorySupplyChain;