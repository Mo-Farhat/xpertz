import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { createLedgerTransaction } from './ledgerTransactionService';
import { Expense } from '../../components/features/Expenses/types';

export const createExpenseWithIntegrations = async (
  userId: string,
  expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
) => {
  // Create expense document
  const expenseRef = await addDoc(collection(db, 'expenses'), {
    ...expense,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    date: Timestamp.fromDate(expense.date)
  });

  // Create corresponding ledger entry
  await createLedgerTransaction(userId, {
    date: expense.date,
    description: expense.description,
    accountNumber: '5000', // Expense account
    accountName: 'Expenses',
    category: expense.category,
    debit: expense.amount,
    credit: 0,
    reference: expenseRef.id,
    status: 'pending',
    moduleType: 'EXP',
    moduleId: expenseRef.id
  });

  // If expense requires approval, create approval request
  if (expense.amount > 1000) {
    await addDoc(collection(db, 'approvalRequests'), {
      type: 'expense',
      referenceId: expenseRef.id,
      amount: expense.amount,
      requestedBy: userId,
      status: 'pending',
      createdAt: Timestamp.now(),
      category: expense.category
    });
  }

  // Update budget tracking
  const budgetRef = doc(db, 'budgets', expense.category);
  await updateDoc(budgetRef, {
    actualSpend: expense.amount,
    lastUpdated: Timestamp.now()
  });

  return expenseRef.id;
};

export const updateExpenseWithIntegrations = async (
  userId: string,
  expenseId: string,
  updates: Partial<Expense>
) => {
  const expenseRef = doc(db, 'expenses', expenseId);
  
  await updateDoc(expenseRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });

  // Update ledger if amount changed
  if (updates.amount) {
    await createLedgerTransaction(userId, {
      date: new Date(),
      description: `Expense adjustment: ${updates.description || 'Amount update'}`,
      accountNumber: '5000',
      accountName: 'Expenses',
      category: updates.category || 'Adjustment',
      debit: updates.amount,
      credit: 0,
      reference: expenseId,
      status: 'pending',
      moduleType: 'EXP',
      moduleId: expenseId
    });
  }
};