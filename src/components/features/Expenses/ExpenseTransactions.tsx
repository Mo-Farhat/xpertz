import React, { useState } from 'react';
import { useToast } from "../../hooks/use-toast";
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import ExportButton from './ExportButton';
import { useExpenseFirestore } from '../../hooks/useExpenseFirestore';
import { Expense } from './types';

const ExpenseTransactions = () => {
  const { toast } = useToast();
  const { expenses, isLoading, addExpense, updateExpense, deleteExpense } = useExpenseFirestore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>({
    date: new Date(),
    description: '',
    amount: 0,
    category: '',
    status: 'pending',
  });

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addExpense(newExpense);
      setNewExpense({
        date: new Date(),
        description: '',
        amount: 0,
        category: '',
        status: 'pending'
      });
    } catch (error) {
      // Error is already handled in useExpenseFirestore
      console.error('Error in handleAddExpense:', error);
    }
  };

  const handleExport = () => {
    const csvContent = expenses.map(expense => 
      `${expense.date.toISOString()},${expense.description},${expense.amount},${expense.category},${expense.status}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'expenses.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <ExpenseForm
        newExpense={newExpense}
        setNewExpense={setNewExpense}
        onSubmit={handleAddExpense}
      />
      <ExportButton onClick={handleExport} />
      <ExpenseTable
        expenses={expenses}
        isLoading={isLoading}
        editingId={editingId}
        onEdit={setEditingId}
        onUpdate={updateExpense}
        onDelete={deleteExpense}
      />
    </div>
  );
};

export default ExpenseTransactions;