import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import StockLevelsReport from './Inventory/StockLevelsReport';
import StockMovementReport from './Inventory/StockMovement/StockMovementReport';
import InventoryValuationReport from './Inventory/InventoryValuationReport';
import ReorderReport from './Inventory/ReorderReport';
import AgingInventoryReport from './Inventory/Aging/AgingInventoryReport';
import InventoryTurnoverReport from './Inventory/InventoryTurnoverReport';

const InventoryReports = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Inventory Reports</h2>
      
      <Tabs defaultValue="stock-levels" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="stock-levels">Stock Levels</TabsTrigger>
          <TabsTrigger value="stock-movement">Stock Movement</TabsTrigger>
          <TabsTrigger value="valuation">Inventory Valuation</TabsTrigger>
          <TabsTrigger value="reorder">Reorder Report</TabsTrigger>
          <TabsTrigger value="aging">Aging Inventory</TabsTrigger>
          <TabsTrigger value="turnover">Inventory Turnover</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stock-levels">
          <StockLevelsReport />
        </TabsContent>
        
        <TabsContent value="stock-movement">
          <StockMovementReport />
        </TabsContent>

        <TabsContent value="valuation">
          <InventoryValuationReport />
        </TabsContent>

        <TabsContent value="reorder">
          <ReorderReport />
        </TabsContent>

        <TabsContent value="aging">
          <AgingInventoryReport />
        </TabsContent>

        <TabsContent value="turnover">
          <InventoryTurnoverReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryReports;