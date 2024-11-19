import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import InventoryManager from './InventoryControl/InventoryManager';
import InventoryReports from './InventoryControl/Reports/InventoryReports';
import { useInventory } from './InventoryControl/useInventory';
const InventoryControl = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useInventory();
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Inventory Control</h2>
      
      <Tabs defaultValue="management" className="w-full">
        <TabsList>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="management">
          <InventoryManager 
            loading={loading}
            products={products}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
          />
        </TabsContent>
        
        <TabsContent value="reports">
          <InventoryReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default InventoryControl;