import React, { useState } from 'react';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Customer, CartItem, HirePurchaseAgreement } from './types';

interface HirePurchaseFormProps {
  customers: Customer[];
  hirePurchaseItems: CartItem[];
  onConfirm: (formData: HirePurchaseAgreement) => void;
  onBack: () => void;
}

const HirePurchaseForm: React.FC<HirePurchaseFormProps> = ({
  customers,
  hirePurchaseItems,
  onConfirm,
  onBack
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [months, setMonths] = useState(6);
  const [interestRate, setInterestRate] = useState(5);
  const [downPayment, setDownPayment] = useState(0);
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');

  const totalAmount = hirePurchaseItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const amountToFinance = totalAmount - downPayment;
  const monthlyPayment = (amountToFinance * (1 + interestRate / 100)) / months;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    onConfirm({
      selectedCustomer: { id: selectedCustomer.id, name: selectedCustomer.name },
      items: hirePurchaseItems,
      months,
      interestRate,
      downPayment,
      paymentFrequency,
      totalAmount,
      amountToFinance,
      monthlyPayment
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hire Purchase Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select onValueChange={(value) => setSelectedCustomer(JSON.parse(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={JSON.stringify(customer)}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700">Down Payment</label>
            <Input
              id="downPayment"
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              min={0}
              max={totalAmount}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="months" className="block text-sm font-medium text-gray-700">Number of Months</label>
            <Input
              id="months"
              type="number"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              min={1}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
            <Input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              min={0}
              step={0.1}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700">Payment Frequency</label>
            <Select onValueChange={setPaymentFrequency} value={paymentFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>Back</Button>
            <Button type="submit" disabled={!selectedCustomer}>Confirm Agreement</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default HirePurchaseForm;