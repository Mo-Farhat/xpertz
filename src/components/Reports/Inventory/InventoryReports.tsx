import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import StockLevelsReport from './StockLevelsReport';
import StockMovementReport from './StockMovement/StockMovementReport';
import InventoryValuationReport from './InventoryValuationReport';
import AgingInventoryReport from './Aging/AgingInventoryReport';
import InventoryTurnoverReport from './InventoryTurnoverReport';

const InventoryReports = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Inventory Reports</h2>
      
      <Tabs defaultValue="valuation" className="w-full">
        <TabsList>
          <TabsTrigger value="valuation">Inventory Valuation</TabsTrigger>
          <TabsTrigger value="aging">Stock Aging</TabsTrigger>
          <TabsTrigger value="turnover">Inventory Turnover</TabsTrigger>
          <TabsTrigger value="movement">Stock Movement</TabsTrigger>
          <TabsTrigger value="levels">Stock Levels</TabsTrigger>
        </TabsList>
        
        <TabsContent value="valuation">
          <InventoryValuationReport />
        </TabsContent>
        
        <TabsContent value="aging">
          <AgingInventoryReport />
        </TabsContent>

        <TabsContent value="turnover">
          <InventoryTurnoverReport />
        </TabsContent>

        <TabsContent value="movement">
          <StockMovementReport />
        </TabsContent>

        <TabsContent value="levels">
          <StockLevelsReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryReports;