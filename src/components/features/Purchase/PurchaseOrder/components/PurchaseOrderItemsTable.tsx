import React from 'react';
import { PurchaseOrderItem } from '../types/purchaseOrderTypes';

interface PurchaseOrderItemsTableProps {
  items: PurchaseOrderItem[];
}

const PurchaseOrderItemsTable: React.FC<PurchaseOrderItemsTableProps> = ({ items }) => {
  return (
    <div className="mt-4">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Product</th>
            <th className="text-left">Quantity</th>
            <th className="text-left">Unit Price</th>
            <th className="text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>${item.unitPrice.toFixed(2)}</td>
              <td>${item.totalPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrderItemsTable;