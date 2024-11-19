import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import StockLevelReport from './StockLevelReport';
import ValueReport from './ValueReport';
import MovementReport from './MovementReport';
import TurnoverReport from './TurnoverReport';

const InventoryReports = () => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="stock-levels" className="w-full">
        <TabsList>
          <TabsTrigger value="stock-levels">Stock Levels</TabsTrigger>
          <TabsTrigger value="value">Inventory Value</TabsTrigger>
          <TabsTrigger value="movement">Stock Movement</TabsTrigger>
          <TabsTrigger value="turnover">Turnover Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stock-levels">
          <StockLevelReport />
        </TabsContent>
        
        <TabsContent value="value">
          <ValueReport />
        </TabsContent>
        
        <TabsContent value="movement">
          <MovementReport />
        </TabsContent>
        
        <TabsContent value="turnover">
          <TurnoverReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryReports;