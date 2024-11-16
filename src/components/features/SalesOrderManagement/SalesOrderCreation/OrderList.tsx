import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from "../../../ui/button";
import { SalesOrder } from './types';

interface OrderListProps {
  orders: SalesOrder[];
  onDelete: (id: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onDelete }) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border p-4 rounded">
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-semibold">{order.customerName}</h5>
              <p className="text-sm text-gray-500">
                {order.orderDate.toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(order.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${order.status === 'quote' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'order' ? 'bg-blue-100 text-blue-800' :
              order.status === 'invoice' ? 'bg-purple-100 text-purple-800' :
              'bg-green-100 text-green-800'}`}>
              {order.status}
            </span>
            <span className="ml-2 text-sm font-medium">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;