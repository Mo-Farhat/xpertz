import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Expense } from '../features/Expenses/types';

export const useExpenseList = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
  
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const expensesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate(),
            createdAt: doc.data().createdAt.toDate(),
            updatedAt: doc.data().updatedAt.toDate(),
            approvedAt: doc.data().approvedAt?.toDate(),
          } as Expense));
          
          setExpenses(expensesData);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching expenses:", error);
          setError("Failed to fetch expenses");
          setIsLoading(false);
        }
      );
  
      return () => unsubscribe();
    }, []);
  
    return { expenses, isLoading, error };
  };