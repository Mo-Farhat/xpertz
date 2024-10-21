import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { CartItem } from './types';

interface HirePurchaseSummaryProps {
  hirePurchaseItems: CartItem[];
}

const HirePurchaseSummary: React.FC<HirePurchaseSummaryProps> = ({ hirePurchaseItems }) => {
  const totalAmount = hirePurchaseItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hire Purchase Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-2xl font-bold">Total: ${totalAmount.toFixed(2)}</div>
          <div className="space-y-2">
            {hirePurchaseItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <span className="font-semibold">{item.name}</span>
                  <br />
                  <span className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </span>
                </div>
                <div className="text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HirePurchaseSummary;