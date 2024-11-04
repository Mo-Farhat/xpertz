import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import StockLevelsReport from './Inventory/StockLevelsReport';
import StockMovementReport from './Inventory/StockMovementReport';
import InventoryValuationReport from './Inventory/InventoryValuationReport';
import ReorderReport from './Inventory/ReorderReport';
import AgingInventoryReport from './Inventory/Aging/AgingInventoryReport';
import InventoryTurnoverReport from './Inventory/InventoryTurnoverReport';
import DamagedLostReport from './Inventory/DamagedLostReport';
import BackorderReport from './Inventory/BackorderReport';
import WarehouseUtilizationReport from './Inventory/WarehouseUtilizationReport';
import DemandForecastReport from './Inventory/DemandForecastReport';
import InventoryCostAnalysisReport from './Inventory/InventoryCostAnalysisReport';

const InventoryReports = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Inventory Reports</h2>
      
      <Tabs defaultValue="stock-levels" className="w-full">
        <div className="flex flex-col gap-2">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="stock-levels">Stock Levels</TabsTrigger>
            <TabsTrigger value="stock-movement">Stock Movement</TabsTrigger>
            <TabsTrigger value="valuation">Inventory Valuation</TabsTrigger>
            <TabsTrigger value="reorder">Reorder Report</TabsTrigger>
            <TabsTrigger value="aging">Aging Inventory</TabsTrigger>
            <TabsTrigger value="turnover">Inventory Turnover</TabsTrigger>
          </TabsList>
          
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="damaged-lost">Damaged & Lost</TabsTrigger>
            <TabsTrigger value="backorder">Backorders</TabsTrigger>
            <TabsTrigger value="warehouse">Warehouse Utilization</TabsTrigger>
            <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
            <TabsTrigger value="cost-analysis">Cost Analysis</TabsTrigger>
          </TabsList>
        </div>
        
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

        <TabsContent value="damaged-lost">
          <DamagedLostReport />
        </TabsContent>

        <TabsContent value="backorder">
          <BackorderReport />
        </TabsContent>

        <TabsContent value="warehouse">
          <WarehouseUtilizationReport />
        </TabsContent>

        <TabsContent value="forecast">
          <DemandForecastReport />
        </TabsContent>

        <TabsContent value="cost-analysis">
          <InventoryCostAnalysisReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryReports;