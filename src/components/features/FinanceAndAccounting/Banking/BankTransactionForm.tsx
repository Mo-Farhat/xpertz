import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import { BankTransaction } from './types';

interface BankTransactionFormProps {
  newTransaction: Omit<BankTransaction, 'id'>;
  setNewTransaction: (transaction: Omit<BankTransaction, 'id'>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const BankTransactionForm: React.FC<BankTransactionFormProps> = ({
  newTransaction,
  setNewTransaction,
  onSubmit,
}) => {
  const categories = [
    'Income',
    'Expense',
    'Transfer',
    'Investment',
    'Loan',
    'Interest',
    'Fee',
    'Tax',
    'Other'
  ];

  const paymentMethods = [
    'Cash',
    'Check',
    'Bank Transfer',
    'Credit Card',
    'Debit Card',
    'Mobile Payment',
    'Wire Transfer',
    'Other'
  ];

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Input
        type="date"
        value={newTransaction.date.toISOString().split('T')[0]}
        onChange={(e) => setNewTransaction({ ...newTransaction, date: new Date(e.target.value) })}
        className="w-full"
      />
      
      <Input
        type="text"
        placeholder="Description"
        value={newTransaction.description}
        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
        className="w-full"
      />
      
      <Input
        type="number"
        placeholder="Amount"
        value={newTransaction.amount}
        onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
        step="0.01"
        className="w-full"
      />

      <Select
        value={newTransaction.type}
        onValueChange={(value: 'credit' | 'debit') => setNewTransaction({ ...newTransaction, type: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="credit">Credit</SelectItem>
          <SelectItem value="debit">Debit</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={newTransaction.category}
        onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category.toLowerCase()}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={newTransaction.paymentMethod}
        onValueChange={(value) => setNewTransaction({ ...newTransaction, paymentMethod: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Payment method" />
        </SelectTrigger>
        <SelectContent>
          {paymentMethods.map((method) => (
            <SelectItem key={method} value={method.toLowerCase()}>
              {method}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Reference Number"
        value={newTransaction.referenceNumber}
        onChange={(e) => setNewTransaction({ ...newTransaction, referenceNumber: e.target.value })}
        className="w-full"
      />

      <Select
        value={newTransaction.status}
        onValueChange={(value: 'pending' | 'completed' | 'cancelled') => 
          setNewTransaction({ ...newTransaction, status: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Textarea
        placeholder="Notes"
        value={newTransaction.notes}
        onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
        className="w-full col-span-full"
      />

      <Button type="submit" className="col-span-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Transaction
      </Button>
    </form>
  );
};

export default BankTransactionForm;