import React, { useState } from 'react';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useSalesContext } from './SalesContext';
import { CreditCard, DollarSign, Calendar, Percent, ArrowRight, Info, User } from 'lucide-react';
import Numpad from './Numpad';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import Select from 'react-select';
import { useToast } from "../../hooks/use-toast";
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebase';

interface HirePurchasePaymentValidationProps {
  onBack: () => void;
}

const HirePurchasePaymentValidation: React.FC<HirePurchasePaymentValidationProps> = ({ onBack }) => {
  const { 
    calculateTotal, 
    cart,
    customers, 
    selectedCustomer, 
    setSelectedCustomer,
    clearCart 
  } = useSalesContext();
  
  const [downPayment, setDownPayment] = useState(0);
  const [months, setMonths] = useState(6);
  const [interestRate, setInterestRate] = useState(0);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const totalAmount = calculateTotal();
  const amountToFinance = totalAmount - downPayment;
  const monthlyPayment = (amountToFinance * (1 + interestRate / 100)) / months;

  const handleNumpadClick = (value: string) => {
    if (activeInput === 'downPayment') {
      setDownPayment(prev => Number(prev + value));
    } else if (activeInput === 'months') {
      setMonths(prev => Number(prev + value));
    } else if (activeInput === 'interestRate') {
      setInterestRate(prev => Number(prev + value));
    }
  };

  const handleBackspaceClick = () => {
    if (activeInput === 'downPayment') {
      setDownPayment(prev => Number(String(prev).slice(0, -1)));
    } else if (activeInput === 'months') {
      setMonths(prev => Number(String(prev).slice(0, -1)));
    } else if (activeInput === 'interestRate') {
      setInterestRate(prev => Number(String(prev).slice(0, -1)));
    }
  };

  const generatePaymentSchedule = () => {
    const payments = [];
    const startDate = new Date();
    
    for (let i = 0; i < months; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      
      payments.push({
        id: `payment-${i + 1}`,
        amount: monthlyPayment,
        dueDate,
        status: 'pending'
      });
    }
    
    return payments;
  };

  const handleValidate = async () => {
    if (!selectedCustomer) {
      toast({
        title: "Error",
        description: "Please select a customer before confirming the agreement.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + months);

      const agreementData = {
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0
        })),
        totalAmount,
        downPayment,
        amountFinanced: amountToFinance,
        interestRate,
        term: months,
        monthlyPayment,
        startDate,
        endDate,
        payments: generatePaymentSchedule(),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'hirePurchaseAgreements'), agreementData);
      
      toast({
        title: "Success",
        description: `Hire purchase agreement created successfully. Agreement ID: ${docRef.id}`,
      });
      
      clearCart();
      onBack();
    } catch (error) {
      console.error('Error creating hire purchase agreement:', error);
      toast({
        title: "Error",
        description: "Failed to create hire purchase agreement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const customerOptions = customers.map(customer => ({
    value: customer.id,
    label: customer.name
  }));

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-bold text-blue-600">
                <User className="mr-2" />
                Select Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                options={customerOptions}
                value={selectedCustomer ? { value: selectedCustomer.id, label: selectedCustomer.name } : null}
                onChange={(option) => setSelectedCustomer(customers.find(c => c.id === option?.value) || null)}
                placeholder="Choose a customer"
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2" />
                Hire Purchase Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="text-green-500" />
                <Input
                  type="number"
                  placeholder="Down Payment"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  onFocus={() => setActiveInput('downPayment')}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="text-blue-500" />
                <Input
                  type="number"
                  placeholder="Number of Months"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  onFocus={() => setActiveInput('months')}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Percent className="text-purple-500" />
                <Input
                  type="number"
                  placeholder="Interest Rate (%)"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  onFocus={() => setActiveInput('interestRate')}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-green-600 flex items-center justify-between">
                <span>Total Amount</span>
                <span>{totalAmount.toFixed(2)} Rs</span>
              </div>
              <div className="bg-green-100 p-4 rounded-md">
                <div className="font-semibold flex items-center">
                  <ArrowRight className="mr-2 text-green-600" />
                  Monthly Payment
                </div>
                <div className="text-2xl font-bold text-green-600">{monthlyPayment.toFixed(2)} Rs</div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Down Payment', value: downPayment.toFixed(2), icon: DollarSign, color: 'text-green-500' },
                  { label: 'Amount to Finance', value: amountToFinance.toFixed(2), icon: CreditCard, color: 'text-blue-500' },
                  { label: 'Number of Months', value: months, icon: Calendar, color: 'text-purple-500' },
                  { label: 'Interest Rate', value: `${interestRate}%`, icon: Percent, color: 'text-orange-500' },
                ].map((item, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md cursor-help">
                        <span className="flex items-center">
                          <item.icon className={`mr-2 ${item.color}`} />
                          {item.label}
                        </span>
                        <span className="font-semibold">{item.value} {item.label === 'Down Payment' || item.label === 'Amount to Finance' ? 'Rs' : ''}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is the {item.label.toLowerCase()}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="mt-4">
            <Numpad
              onNumberClick={handleNumpadClick}
              onDiscountClick={() => {}}
              onBackspaceClick={handleBackspaceClick}
              onEnterClick={() => {}}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" onClick={onBack}>Back</Button>
            <Button onClick={handleValidate} disabled={isLoading || !selectedCustomer}>
              {isLoading ? 'Processing...' : 'Confirm Agreement'}
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default HirePurchasePaymentValidation;
