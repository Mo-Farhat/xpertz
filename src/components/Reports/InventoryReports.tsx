import React from 'react';
import { TabsContent } from '../../components/ui/tabs';
import InventoryValuation from './Inventory/InventoryValuationReport';
import StockAging from './Inventory/StockAging';

const InventoryReports = () => {
  return (
    <>
      <TabsContent value="valuation">
        <InventoryValuation />
      </TabsContent>
      
      <TabsContent value="aging">
        <StockAging />
      </TabsContent>
    </>
  );
};

export default InventoryReports;