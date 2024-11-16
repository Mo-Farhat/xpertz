import React, { useState } from 'react';
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { useToast } from "../../hooks/use-toast";
import { addDoc, collection, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useSalesContext } from './SalesContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

interface ReturnFormProps {
  onComplete?: () => void;
}

const RETURN_REASONS = [
  'Defective Product',
  'Wrong Item Received',
  'Size/Fit Issue',
  'Changed Mind',
  'Other'
];

const ReturnForm: React.FC<ReturnFormProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { selectedCustomer } = useSalesContext();
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [returnItems, setReturnItems] = useState<Array<{
    productId: string;
    quantity: number;
    condition: 'good' | 'damaged';
  }>>([]);
  const [selectedReason, setSelectedReason] = useState('');
  const [loading, setLoading] = useState(false);

  const validateReturn = async () => {
    if (!selectedCustomer) {
      toast({
        title: "Error",
        description: "Please select a customer before processing a return",
        variant: "destructive",
      });
      return false;
    }

    if (!orderId || !amount || !reason || returnItems.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    // Verify order exists and belongs to customer
    const orderRef = doc(db, 'sales', orderId);
    const orderDoc = await getDoc(orderRef);
    if (!orderDoc.exists()) {
      toast({
        title: "Error",
        description: "Order not found",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isValid = await validateReturn();
      if (!isValid) return;

      // Create return record
      const returnRef = await addDoc(collection(db, 'returnsRefunds'), {
        orderId,
        customerName: selectedCustomer?.name,
        customerId: selectedCustomer?.id,
        reason: selectedReason + (reason ? `: ${reason}` : ''),
        status: 'pending',
        amount: parseFloat(amount),
        items: returnItems,
        requestDate: new Date(),
        createdAt: new Date(),
      });

      // Update inventory for returned items
      for (const item of returnItems) {
        const productRef = doc(db, 'inventory', item.productId);
        await updateDoc(productRef, {
          quantity: increment(item.quantity)
        });
      }

      // Create financial transaction record
      await addDoc(collection(db, 'financialTransactions'), {
        type: 'return',
        referenceId: returnRef.id,
        amount: parseFloat(amount),
        customerId: selectedCustomer?.id,
        status: 'pending',
        createdAt: new Date()
      });

      toast({
        title: "Success",
        description: "Return request submitted successfully",
      });

      if (onComplete) {
        onComplete();
      }

      // Reset form
      setOrderId('');
      setAmount('');
      setReason('');
      setReturnItems([]);
      setSelectedReason('');
      
    } catch (error) {
      console.error('Error processing return:', error);
      toast({
        title: "Error",
        description: "Failed to process return request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addReturnItem = (productId: string, quantity: number, condition: 'good' | 'damaged') => {
    setReturnItems(prev => [...prev, { productId, quantity, condition }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <Input
          id="orderId"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />
        
        <Select value={selectedReason} onValueChange={setSelectedReason}>
          <SelectTrigger>
            <SelectValue placeholder="Select return reason" />
          </SelectTrigger>
          <SelectContent>
            {RETURN_REASONS.map(reason => (
              <SelectItem key={reason} value={reason}>
                {reason}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="Return Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <Textarea
          id="reason"
          placeholder="Additional Details"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit Return"}
      </Button>
    </form>
  );
};

export default ReturnForm;