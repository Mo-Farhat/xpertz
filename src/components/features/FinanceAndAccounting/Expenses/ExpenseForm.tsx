import React from 'react';
import { Plus } from 'lucide-react';
import { Expense } from './types';

interface ExpenseFormProps {
  newExpense: Omit<Expense, 'id'>;
  setNewExpense: (expense: Omit<Expense, 'id'>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ newExpense, setNewExpense, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          value={newExpense.date.toISOString().split('T')[0]}
          onChange={(e) => setNewExpense({ ...newExpense, date: new Date(e.target.value) })}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
          className="p-2 border rounded"
          required
          min="0"
        />
        <input
          type="text"
          placeholder="Category"
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <select
          value={newExpense.status}
          onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value as 'pending' | 'approved' | 'rejected' })}
          className="p-2 border rounded"
          required
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} />
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;