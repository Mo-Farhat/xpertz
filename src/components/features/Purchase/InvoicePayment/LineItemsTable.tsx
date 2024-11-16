import React from 'react';
import { Button } from "../../../../components/ui/button";
import { Trash2 } from "lucide-react";
import { LineItemsTableProps } from './types';

const LineItemsTable: React.FC<LineItemsTableProps> = ({ items, onRemoveItem }) => {
  return (
    <div className="mt-4">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Description</th>
            <th className="text-right p-2">Quantity</th>
            <th className="text-right p-2">Unit Price</th>
            <th className="text-right p-2">Total</th>
            <th className="text-right p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.description}</td>
              <td className="text-right p-2">{item.quantity}</td>
              <td className="text-right p-2">${item.unitPrice.toFixed(2)}</td>
              <td className="text-right p-2">${item.totalPrice.toFixed(2)}</td>
              <td className="text-right p-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LineItemsTable;