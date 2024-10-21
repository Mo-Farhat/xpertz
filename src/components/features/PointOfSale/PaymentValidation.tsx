import React, { useState } from 'react';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useSalesContext } from './SalesContext';
import { CreditCard, DollarSign, UserPlus } from 'lucide-react';
import Numpad from './Numpad';

interface PaymentValidationProps {
  onBack: () => void;
}

const PaymentValidation: React.FC<PaymentValidationProps> = ({ onBack }) => {
  const { calculateTotal } = useSalesContext();
  const [paymentMethods, setPaymentMethods] = useState({
    cash: 0,
    card: 0,
    customerAccount: 0
  });
  const [activeMethod, setActiveMethod] = useState<keyof typeof paymentMethods>('cash');

  const totalAmount = calculateTotal();
  const totalPaid = Object.values(paymentMethods).reduce((sum, value) => sum + value, 0);
  const change = totalPaid - totalAmount;

  const handlePaymentChange = (method: keyof typeof paymentMethods, value: string) => {
    const numValue = parseFloat(value) || 0;
    setPaymentMethods(prev => ({ ...prev, [method]: numValue }));
  };

  const handleNumpadClick = (value: string) => {
    if (value === '+/-') {
      setPaymentMethods(prev => ({
        ...prev,
        [activeMethod]: prev[activeMethod] * -1
      }));
    } else {
      const currentValue = paymentMethods[activeMethod].toString();
      const newValue = currentValue === '0' ? value : currentValue + value;
      handlePaymentChange(activeMethod, newValue);
    }
  };

  const handleValidate = () => {
    // Implement validation logic here
    console.log('Payment validated');
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <DollarSign />
              <Input
                type="number"
                placeholder="Cash"
                value={paymentMethods.cash || ''}
                onChange={(e) => handlePaymentChange('cash', e.target.value)}
                onFocus={() => setActiveMethod('cash')}
              />
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard />
              <Input
                type="number"
                placeholder="Card"
                value={paymentMethods.card || ''}
                onChange={(e) => handlePaymentChange('card', e.target.value)}
                onFocus={() => setActiveMethod('card')}
              />
            </div>
            <div className="flex items-center space-x-2">
              <UserPlus />
              <Input
                type="number"
                placeholder="Customer Account"
                value={paymentMethods.customerAccount || ''}
                onChange={(e) => handlePaymentChange('customerAccount', e.target.value)}
                onFocus={() => setActiveMethod('customerAccount')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-green-600">{totalAmount.toFixed(2)} Rs</div>
            <div className="bg-green-100 p-4 rounded-md">
              <div className="font-semibold">Change</div>
              <div className="text-2xl font-bold text-green-600">{change.toFixed(2)} Rs</div>
            </div>
            {Object.entries(paymentMethods).map(([method, amount]) => (
              amount > 0 && (
                <div key={method} className="flex justify-between items-center">
                  <span className="capitalize">{method}</span>
                  <span>{amount.toFixed(2)} Rs</span>
                </div>
              )
            ))}
          </CardContent>
        </Card>
        <div className="mt-4">
          <Numpad onNumberClick={handleNumpadClick} />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={handleValidate}>Validate</Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentValidation;