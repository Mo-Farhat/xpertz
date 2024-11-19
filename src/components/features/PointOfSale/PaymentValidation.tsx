import React, { useState, useRef } from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { useSalesContext } from './SalesContext';
import { CreditCard, DollarSign, UserPlus, Printer } from 'lucide-react';
import Numpad from './Numpad';
import Receipt from './Receipt';
import { useAuth } from '../../../contexts/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useToast } from "../../hooks/use-toast";
import { printReceipt } from './printUtils';

interface PaymentValidationProps {
  onBack: () => void;
}

const PaymentValidation: React.FC<PaymentValidationProps> = ({ onBack }) => {
  const { calculateTotal, cart, paymentMethod, handleCheckout } = useSalesContext();
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState({
    cash: 0,
    card: 0,
    customerAccount: 0
  });
  const [activeMethod, setActiveMethod] = useState<keyof typeof paymentMethods>('cash');
  const receiptRef = useRef<HTMLDivElement>(null);

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

  const createDayBookEntry = async (paymentMethod: string, amount: number) => {
    if (!user?.uid || amount <= 0) return;

    try {
      await addDoc(collection(db, `users/${user.uid}/dayBook`), {
        date: new Date(),
        transactionType: 'sales',
        reference: `SALE-${Date.now()}`,
        description: `Sales payment received via ${paymentMethod}`,
        debit: amount,
        credit: 0,
        account: paymentMethod === 'cash' ? 'Cash Account' : 
                paymentMethod === 'card' ? 'Bank Account' : 'Accounts Receivable',
        status: 'completed',
        userId: user.uid
      });
    } catch (error) {
      console.error('Error creating daybook entry:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record payment in daybook"
      });
    }
  };

  const handlePrint = () => {
    if (receiptRef.current) {
      printReceipt(receiptRef.current);
      toast({
        title: "Success",
        description: "Receipt sent to printer",
      });
    }
  };

  const handleValidate = async () => {
    if (totalPaid < totalAmount) {
      toast({
        variant: "destructive",
        title: "Invalid Payment",
        description: "Total paid amount must be equal to or greater than the total amount"
      });
      return;
    }

    try {
      // Create daybook entries for each payment method
      for (const [method, amount] of Object.entries(paymentMethods)) {
        if (amount > 0) {
          await createDayBookEntry(method, amount);
        }
      }

      // Create inventory adjustment entries
      for (const item of cart) {
        await addDoc(collection(db, `users/${user?.uid}/dayBook`), {
          date: new Date(),
          transactionType: 'inventory',
          reference: `INV-${Date.now()}`,
          description: `Inventory adjustment for sale of ${item.name}`,
          debit: 0,
          credit: item.price * item.quantity,
          account: 'Inventory',
          status: 'completed',
          userId: user?.uid
        });
      }

      await handleCheckout();
      handlePrint();
      toast({
        title: "Success",
        description: "Payment recorded successfully"
      });
      
      onBack();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment"
      });
    }
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
            <Numpad
              onNumberClick={handleNumpadClick}
              onDiscountClick={() => {}}
              onBackspaceClick={() => {
                const currentValue = paymentMethods[activeMethod].toString();
                handlePaymentChange(activeMethod, currentValue.slice(0, -1));
              }}
              onEnterClick={handleValidate}
            />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={onBack}>Back</Button>
              <Button onClick={handleValidate} disabled={totalPaid < totalAmount}>
                Complete Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Receipt Preview</CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrint}
              className="h-8 w-8"
            >
              <Printer className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div ref={receiptRef}>
              <Receipt
                items={cart}
                subtotal={totalAmount}
                total={totalAmount}
                paymentMethod={paymentMethod}
                paymentAmount={totalPaid}
                change={change}
                date={new Date()}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentValidation;