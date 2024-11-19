import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { OrderItem } from './types';

interface OrderItemsTableProps {
  items: OrderItem[];
}

const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item ID</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.itemId}>
            <TableCell>{item.itemId}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              ${(item.quantity * item.price).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderItemsTable;