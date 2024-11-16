import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export interface ExpenseData {
  id: string;
  date: Date;
  category: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export const useExpenseData = (timeframe: 'month' | 'quarter' | 'year') => {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const expensesQuery = query(
      collection(db, 'expenses'),
      where('date', '>=', Timestamp.fromDate(startDate)),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      expensesQuery,
      (snapshot) => {
        const expensesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as ExpenseData[];

        setExpenses(expensesData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching expenses:', error);
        setError('Failed to load expense data');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [timeframe]);

  return { expenses, isLoading, error };
};