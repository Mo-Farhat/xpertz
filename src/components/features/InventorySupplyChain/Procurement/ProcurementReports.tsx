import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import VendorPerformance from './VendorPerformance';
import PurchaseOrderAnalytics from './PurchaseOrderAnalytics';
import SpendingAnalysis from './SpendingAnalysis';

const ProcurementReports = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Procurement Reports</h2>
      
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
    </div>
  );
};

export default ProcurementReports;