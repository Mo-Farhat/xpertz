import React from 'react';
import { format } from 'date-fns';
import { CartItem } from './types';

interface ReceiptProps {
  items: CartItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  paymentAmount: number;
  change: number;
  date: Date;
}

const Receipt: React.FC<ReceiptProps> = ({
  items,
  subtotal,
  total,
  paymentMethod,
  paymentAmount,
  change,
  date,
}) => {
  return (
    <div className="p-4 bg-white" id="receipt">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Sales Receipt</h2>
        <p className="text-sm text-gray-600">{format(date, 'dd/MM/yyyy HH:mm:ss')}</p>
      </div>

      <div className="border-t border-b py-2 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.quantity}x {item.name}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {subtotal !== total && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>-${(subtotal - total).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment ({paymentMethod}):</span>
          <span>${paymentAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Change:</span>
          <span>${change.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 text-center text-sm">
        <p>Thank you for your purchase!</p>
      </div>
    </div>
  );
};

export default Receipt;