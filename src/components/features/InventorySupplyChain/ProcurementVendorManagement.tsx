import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import VendorForm from './Procurement/VendorForm';
import VendorList from './Procurement/VendorList';
import PurchaseOrderManagement from '../Purchase/PurchaseOrder/PurchaseOrderManagement';
import VendorPerformance from './Procurement/VendorPerformance';
import PurchaseOrderAnalytics from './Procurement/PurchaseOrderAnalytics';
import SpendingAnalysis from './Procurement/SpendingAnalysis';

const ProcurementVendorManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Procurement & Vendor Management</h2>
      
      <Tabs defaultValue="vendors" className="w-full">
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vendors" className="space-y-6">
          <VendorForm />
          <VendorList />
        </TabsContent>
        
        <TabsContent value="purchase-orders">
          <PurchaseOrderManagement />
        </TabsContent>

        <TabsContent value="reports">
          <Tabs defaultValue="vendor-performance" className="w-full">
            <TabsList>
              <TabsTrigger value="vendor-performance">Vendor Performance</TabsTrigger>
              <TabsTrigger value="purchase-orders">Purchase Order Analytics</TabsTrigger>
              <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vendor-performance">
              <VendorPerformance />
            </TabsContent>
            
            <TabsContent value="purchase-orders">
              <PurchaseOrderAnalytics />
            </TabsContent>
            
            <TabsContent value="spending">
              <SpendingAnalysis />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcurementVendorManagement;