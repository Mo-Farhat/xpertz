import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useToast } from "../../../hooks/use-toast";
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import ExportButton from './ExportButton';
import { Expense } from './types';

const ExpenseTransactions = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    date: new Date(),
    description: '',
    amount: 0,
    category: '',
    status: 'pending',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const expensesQuery = query(collection(db, 'expenses'), orderBy('date', 'desc'), limit(50));
    const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: new Date((doc.data().date as { seconds: number }).seconds * 1000)
      })) as Expense[];
      setExpenses(expensesData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'expenses'), newExpense);
      setNewExpense({ date: new Date(), description: '', amount: 0, category: '', status: 'pending' });
      toast({
        title: "Success",
        description: "Expense added successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    }
  };

  const handleUpdateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const expenseDoc = doc(db, 'expenses', id);
      await updateDoc(expenseDoc, updates);
      setEditingId(null);
      toast({
        title: "Success",
        description: "Expense updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
      toast({
        title: "Success",
        description: "Expense deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
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
        editingId={editingId}
        onEdit={setEditingId}
        onUpdate={handleUpdateExpense}
        onDelete={handleDeleteExpense}
      />
    </div>
  );
};

export default ExpenseTransactions;