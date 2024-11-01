import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import FinanceReports from './Reports/FinanceReports';
import SalesCRMReports from './Reports/SalesCRMReports';
import InventoryReports from './Reports/InventoryReports';
import HRReports from './Reports/HRReports';

const Reports: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Reports Dashboard</h2>
      
      <Tabs defaultValue="finance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="sales">Sales & CRM</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="hr">HR & Payroll</TabsTrigger>
        </TabsList>
        
        <TabsContent value="finance">
          <FinanceReports />
        </TabsContent>
        
        <TabsContent value="sales">
          <SalesCRMReports />
        </TabsContent>
        
        <TabsContent value="inventory">
          <InventoryReports />
        </TabsContent>
        
        <TabsContent value="hr">
          <HRReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;