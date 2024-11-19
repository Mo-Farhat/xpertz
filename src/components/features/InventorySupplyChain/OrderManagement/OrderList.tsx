import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Order } from './types';
interface OrderListProps {
  orders: Order[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, order: Partial<Order>) => void;
}
const OrderList: React.FC<OrderListProps> = ({ orders, onDelete, onUpdate }) => {
  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status];
  };
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Tracking</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customerId}</TableCell>
              <TableCell>{format(order.orderDate, 'MMM dd, yyyy')}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                ${order.totalAmount.toFixed(2)}
              </TableCell>
              <TableCell>
                {order.trackingNumber || 'N/A'}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUpdate(order.id, order)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(order.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default OrderList;