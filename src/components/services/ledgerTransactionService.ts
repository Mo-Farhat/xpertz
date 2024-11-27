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

export const createARTransaction = async (userId: string, {
  invoiceNumber,
  customerName,
  amount,
  date,
  description
}: {
  invoiceNumber: string;
  customerName: string;
  amount: number;
  date: Date;
  description: string;
}) => {
  // Create AR entry
  await createLedgerTransaction(userId, {
    date,
    description: `AR Invoice: ${invoiceNumber} - ${customerName}`,
    accountNumber: '1200',
    accountName: 'Accounts Receivable',
    category: 'AR',
    debit: amount,
    credit: 0,
    reference: invoiceNumber,
    status: 'pending',
    moduleType: 'AR',
    moduleId: invoiceNumber
  });

  // Create corresponding revenue entry
  await createLedgerTransaction(userId, {
    date,
    description: `Revenue: ${description}`,
    accountNumber: '4000',
    accountName: 'Revenue',
    category: 'AR',
    debit: 0,
    credit: amount,
    reference: invoiceNumber,
    status: 'pending',
    moduleType: 'AR',
    moduleId: invoiceNumber
  });
};

export const createInventoryTransaction = async (userId: string, {
  productId,
  productName,
  quantity,
  cost,
  type,
  reference
}: {
  productId: string;
  productName: string;
  quantity: number;
  cost: number;
  type: 'purchase' | 'sale';
  reference: string;
}) => {
  const totalCost = quantity * cost;
  const date = new Date();

  if (type === 'purchase') {
    await createLedgerTransaction(userId, {
      date,
      description: `Inventory Purchase: ${productName}`,
      accountNumber: '1300',
      accountName: 'Inventory',
      category: 'INV',
      debit: totalCost,
      credit: 0,
      reference,
      status: 'pending',
      moduleType: 'INV',
      moduleId: productId
    });
  } else {
    await createLedgerTransaction(userId, {
      date,
      description: `Inventory Sale: ${productName}`,
      accountNumber: '1300',
      accountName: 'Inventory',
      category: 'INV',
      debit: 0,
      credit: totalCost,
      reference,
      status: 'pending',
      moduleType: 'INV',
      moduleId: productId
    });
  }
};

export const createAssetTransaction = async (userId: string, {
  assetId,
  assetName,
  cost,
  reference
}: {
  assetId: string;
  assetName: string;
  cost: number;
  reference: string;
}) => {
  const date = new Date();

  await createLedgerTransaction(userId, {
    date,
    description: `Asset Purchase: ${assetName}`,
    accountNumber: '1500',
    accountName: 'Fixed Assets',
    category: 'ASSET',
    debit: cost,
    credit: 0,
    reference,
    status: 'pending',
    moduleType: 'ASSET',
    moduleId: assetId
  });
};