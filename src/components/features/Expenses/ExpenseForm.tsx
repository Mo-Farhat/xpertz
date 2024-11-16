import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Expense } from './types';

interface ExpenseFormProps {
  newExpense: Omit<Expense, 'id'>;
  setNewExpense: (expense: Omit<Expense, 'id'>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ newExpense, setNewExpense, onSubmit }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              value={newExpense.date.toISOString().split('T')[0]}
              onChange={(e) => setNewExpense({ ...newExpense, date: new Date(e.target.value) })}
              required
            />
            
            <Input
              type="text"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              required
            />
            
            <Input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
              required
              min="0"
              step="0.01"
            />
            
            <Input
              type="text"
              placeholder="Category"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              required
            />

            <Select
              value={newExpense.status}
              onValueChange={(value: 'pending' | 'approved' | 'rejected') => 
                setNewExpense({ ...newExpense, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;