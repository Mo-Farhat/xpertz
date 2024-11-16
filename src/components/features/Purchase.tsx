import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import SupplierManagement from './Purchase/SupplierManagement/SupplierManagement';
import PurchaseRequisition from './Purchase/PurchaseRequisition/PurchaseRequisition';
import PurchaseOrderManagement from './Purchase/PurchaseOrder/PurchaseOrderManagement';
import RFQManagement from './Purchase/RFQ/RFQManagement';
import GoodsReceipt from './Purchase/GoodsReceipt/GoodsReceipt';
import InvoicePayment from './Purchase/InvoicePayment/InvoicePayment';
import ReturnManagement from './Purchase/ReturnManagement/ReturnManagement';

const PurchaseModule = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Purchase Management</h1>
      
      <Tabs defaultValue="suppliers" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="rfq">RFQ</TabsTrigger>
          <TabsTrigger value="goods-receipt">Goods Receipt</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers">
          <SupplierManagement />
        </TabsContent>

        <TabsContent value="requisitions">
          <PurchaseRequisition />
        </TabsContent>

        <TabsContent value="purchase-orders">
          <PurchaseOrderManagement />
        </TabsContent>

        <TabsContent value="rfq">
          <RFQManagement />
        </TabsContent>

        <TabsContent value="goods-receipt">
          <GoodsReceipt />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoicePayment />
        </TabsContent>

        <TabsContent value="returns">
          <ReturnManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseModule;