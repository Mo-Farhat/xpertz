import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";

interface CustomerPurchaseTableProps {
  data: Array<{
    customerName: string;
    date: Date;
    total: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  }>;
}

const CustomerPurchaseTable: React.FC<CustomerPurchaseTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((purchase, index) => (
            <TableRow key={index}>
              <TableCell>{purchase.customerName}</TableCell>
              <TableCell>{purchase.date.toLocaleDateString()}</TableCell>
              <TableCell>
                {purchase.items.map(item => 
                  `${item.quantity}x ${item.name}`
                ).join(', ')}
              </TableCell>
              <TableCell>${purchase.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerPurchaseTable;