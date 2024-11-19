import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { useToast } from "../../../hooks/use-toast";
import { Order } from './types';
import OrderTimeline from './OrderTimeline';
import OrderItemsTable from './OrderItemsTable';

interface OrderDetailsProps {
    order: Order;
    onUpdateStatus: (id: string, status: Order['status']) => Promise<void>;
  }
  
  const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onUpdateStatus }) => {
    const { toast } = useToast();
  
    const handleStatusUpdate = async (newStatus: Order['status']) => {
      try {
        await onUpdateStatus(order.id, newStatus);
        toast({
          title: "Status Updated",
          description: `Order status changed to ${newStatus}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive",
        });
      }
    };
  
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Details #{order.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Customer ID</p>
                <p className="font-medium">{order.customerId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{format(order.orderDate, 'PPP')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge
                  className={
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }
                >
                  {order.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
  
            <div className="mt-6">
              <p className="text-sm text-gray-500">Shipping Address</p>
              <p className="font-medium">{order.shippingAddress}</p>
            </div>
  
            {order.trackingNumber && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Tracking Number</p>
                <p className="font-medium">{order.trackingNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>
  
        <OrderTimeline status={order.status} />
        <OrderItemsTable items={order.items} />
  
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => handleStatusUpdate('processing')}
                disabled={order.status !== 'pending'}
              >
                Mark as Processing
              </Button>
              <Button
                onClick={() => handleStatusUpdate('shipped')}
                disabled={order.status !== 'processing'}
              >
                Mark as Shipped
              </Button>
              <Button
                onClick={() => handleStatusUpdate('delivered')}
                disabled={order.status !== 'shipped'}
              >
                Mark as Delivered
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={['delivered', 'cancelled'].includes(order.status)}
              >
                Cancel Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default OrderDetails;