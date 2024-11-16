import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useToast } from "../hooks/use-toast";
import { Expense } from '../features/Expenses/types';
import { useAuth } from '../../contexts/AuthContext';
import { createExpenseWithIntegrations, updateExpenseWithIntegrations } from '../services/expenseIntegrationService';

export const useExpenseFirestore = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const expensesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as Expense));
        
        setExpenses(expensesData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching expenses:", error);
        toast({
          title: "Error",
          description: "Failed to load expenses",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.uid) {
      throw new Error('User must be authenticated to add expenses');
    }

    try {
      await createExpenseWithIntegrations(user.uid, expense);
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    if (!user?.uid) {
      throw new Error('User must be authenticated to update expenses');
    }

    try {
      await updateExpenseWithIntegrations(user.uid, id, updates);
      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    expenses,
    isLoading,
    addExpense,
    updateExpense
  };
};