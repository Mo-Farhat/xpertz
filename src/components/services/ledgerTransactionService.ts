import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export interface LedgerTransaction {
  date: Date;
  description: string;
  accountNumber: string;
  accountName: string;
  category: string;
  debit: number;
  credit: number;
  reference: string;
  status: 'pending' | 'completed' | 'reconciled';
  moduleType: string;
  moduleId: string;
}

export const createLedgerTransaction = async (userId: string, transaction: LedgerTransaction) => {
  if (!userId) throw new Error('User ID is required');

  const ledgerRef = collection(db, `users/${userId}/transactions/${transaction.moduleType}/entries`);
  
  await addDoc(ledgerRef, {
    ...transaction,
    date: Timestamp.fromDate(transaction.date),
    createdAt: Timestamp.fromDate(new Date())
  });
};

export const createAPTransaction = async (userId: string, {
  invoiceNumber,
  vendorName,
  amount,
  date,
  description
}: {
  invoiceNumber: string;
  vendorName: string;
  amount: number;
  date: Date;
  description: string;
}) => {
  // Create AP entry
  await createLedgerTransaction(userId, {
    date,
    description: `AP Invoice: ${invoiceNumber} - ${vendorName}`,
    accountNumber: '2000',
    accountName: 'Accounts Payable',
    category: 'AP',
    debit: 0,
    credit: amount,
    reference: invoiceNumber,
    status: 'pending',
    moduleType: 'AP',
    moduleId: invoiceNumber
  });

  // Create corresponding expense entry
  await createLedgerTransaction(userId, {
    date,
    description: `Expense: ${description}`,
    accountNumber: '5000',
    accountName: 'Expenses',
    category: 'AP',
    debit: amount,
    credit: 0,
    reference: invoiceNumber,
    status: 'pending',
    moduleType: 'AP',
    moduleId: invoiceNumber
  });
};