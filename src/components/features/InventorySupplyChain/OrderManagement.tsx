import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from "../../..//components/ui/button";
import { useToast } from "../..//hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "../../..//components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../..//components/ui/tabs";
import OrderList from './OrderManagement/OrderList';
import OrderDetails from './OrderManagement/OrderDetails';
import OrderForm from './OrderManagement/OrderForm';
import OrderReports from './OrderManagement/Reports/OrderReports';
import { useOrders } from './OrderManagement/useOrder';

const OrderManagement: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const { orders, addOrder, updateOrder, deleteOrder } = useOrders();
  const { toast } = useToast();

  const handleExport = () => {
    const csvContent = [
      ['Order ID', 'Customer ID', 'Order Date', 'Status', 'Total Amount', 'Shipping Address', 'Tracking Number'].join(','),
      ...orders.map(order => [
        order.id,
        order.customerId,
        order.orderDate.toISOString(),
        order.status,
        order.totalAmount,
        order.shippingAddress,
        order.trackingNumber || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'orders.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Order Management</h3>
        <div className="flex gap-4">
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <OrderForm onSubmit={addOrder} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders">
          <OrderList
            orders={orders}
            onView={setSelectedOrder}
            onDelete={deleteOrder}
          />
        </TabsContent>
        
        <TabsContent value="reports">
          <OrderReports />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl">
          {selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              onUpdateStatus={(id, status) => updateOrder(id, { status })}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;