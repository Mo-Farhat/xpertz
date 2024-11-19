import React, { useState } from 'react';
import { NewOrder } from './types';
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import { Plus } from 'lucide-react';

interface OrderFormProps {
  onSubmit: (order: NewOrder) => Promise<void>;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit }) => {
  const [newOrder, setNewOrder] = useState<NewOrder>({
    customerId: '',
    orderDate: new Date(),
    status: 'pending',
    items: [],
    totalAmount: 0,
    shippingAddress: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newOrder);
    setNewOrder({
      customerId: '',
      orderDate: new Date(),
      status: 'pending',
      items: [],
      totalAmount: 0,
      shippingAddress: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="Customer ID"
          value={newOrder.customerId}
          onChange={(e) => setNewOrder({ ...newOrder, customerId: e.target.value })}
        />
        
        <Input
          type="date"
          value={newOrder.orderDate.toISOString().split('T')[0]}
          onChange={(e) => setNewOrder({ ...newOrder, orderDate: new Date(e.target.value) })}
        />

        <Select 
          value={newOrder.status}
          onValueChange={(value: any) => setNewOrder({ ...newOrder, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Total Amount"
          value={newOrder.totalAmount}
          onChange={(e) => setNewOrder({ ...newOrder, totalAmount: parseFloat(e.target.value) })}
        />

        <Textarea
          placeholder="Shipping Address"
          value={newOrder.shippingAddress}
          onChange={(e) => setNewOrder({ ...newOrder, shippingAddress: e.target.value })}
          className="col-span-2"
        />

        <Input
          type="text"
          placeholder="Tracking Number (optional)"
          value={newOrder.trackingNumber || ''}
          onChange={(e) => setNewOrder({ ...newOrder, trackingNumber: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Order
      </Button>
    </form>
  );
};

export default OrderForm;