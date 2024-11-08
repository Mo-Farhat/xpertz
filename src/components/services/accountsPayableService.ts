import { collection, query, getDocs, where, orderBy, limit, Timestamp, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export interface Invoice {
  id: string;
  vendorName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  lastPaymentDate?: Date;
}

export interface AgingBracket {
  range: string;
  amount: number;
  percentage: number;
}

export const fetchInvoicesWithAging = async (tenantId: string, timeRange: 'month' | 'quarter' | 'year' = 'month'): Promise<Invoice[]> => {
  const now = new Date();
  let startDate = new Date();

  switch (timeRange) {
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

  const q = query(
    collection(db, `tenants/${tenantId}/payables`),
    where('dueDate', '>=', Timestamp.fromDate(startDate)),
    orderBy('dueDate'),
    limit(50)
  );

  const snapshot = await getDocs(q);
  return processInvoiceSnapshot(snapshot);
};

export const calculateAgingBrackets = (dueDate: Date, amount: number): AgingBracket[] => {
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const brackets: AgingBracket[] = [
    { range: '0-30', amount: 0, percentage: 0 },
    { range: '31-60', amount: 0, percentage: 0 },
    { range: '61-90', amount: 0, percentage: 0 },
    { range: '90+', amount: 0, percentage: 0 }
  ];

  if (daysDiff <= 30) brackets[0].amount = amount;
  else if (daysDiff <= 60) brackets[1].amount = amount;
  else if (daysDiff <= 90) brackets[2].amount = amount;
  else brackets[3].amount = amount;

  brackets.forEach(bracket => {
    bracket.percentage = (bracket.amount / amount) * 100;
  });

  return brackets;
};

const processInvoiceSnapshot = (snapshot: QuerySnapshot<DocumentData>): Invoice[] => {
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      dueDate: data.dueDate.toDate(),
      lastPaymentDate: data.lastPaymentDate?.toDate(),
    } as Invoice;
  });
};