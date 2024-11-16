import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { FulfillmentOrder } from './types';

interface FulfillmentFormProps {
  fulfillment: Omit<FulfillmentOrder, 'id' | 'createdAt'>;
  onFulfillmentChange: (fulfillment: Omit<FulfillmentOrder, 'id' | 'createdAt'>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const FulfillmentForm: React.FC<FulfillmentFormProps> = ({
  fulfillment,
  onFulfillmentChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Order ID"
          value={fulfillment.orderId}
          onChange={(e) => onFulfillmentChange({ ...fulfillment, orderId: e.target.value })}
        />
        <Input
          placeholder="Customer Name"
          value={fulfillment.customerName}
          onChange={(e) => onFulfillmentChange({ ...fulfillment, customerName: e.target.value })}
        />
        <Select 
          value={fulfillment.status}
          onValueChange={(value: FulfillmentOrder['status']) => 
            onFulfillmentChange({ ...fulfillment, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Shipping Method"
          value={fulfillment.shippingMethod}
          onChange={(e) => onFulfillmentChange({ ...fulfillment, shippingMethod: e.target.value })}
        />
        <Input
          placeholder="Tracking Number"
          value={fulfillment.trackingNumber}
          onChange={(e) => onFulfillmentChange({ ...fulfillment, trackingNumber: e.target.value })}
        />
        <Input
          type="date"
          value={fulfillment.estimatedDeliveryDate.toISOString().split('T')[0]}
          onChange={(e) => onFulfillmentChange({ 
            ...fulfillment, 
            estimatedDeliveryDate: new Date(e.target.value) 
          })}
        />
      </div>
      <Button type="submit" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Fulfillment
      </Button>
    </form>
  );
};

export default FulfillmentForm;