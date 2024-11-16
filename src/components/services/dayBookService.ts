import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { DayBookEntry } from '../../components/features/FinanceAndAccounting/GeneralLedger/DayBook/types';

export const fetchDayBookEntries = async (
  userId: string,
  dateRange: { from: Date; to: Date }
): Promise<DayBookEntry[]> => {
  const entries: DayBookEntry[] = [];
  
  const q = query(
    collection(db, `users/${userId}/dayBook`),
    where('timestamp', '>=', Timestamp.fromDate(dateRange.from)),
    where('timestamp', '<=', Timestamp.fromDate(dateRange.to)),
    orderBy('timestamp', 'desc')
  );

  const snapshot = await getDocs(q);
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    entries.push({
      id: doc.id,
      timestamp: data.timestamp.toDate(),
      transactionType: data.transactionType,
      reference: data.reference,
      description: data.description,
      debit: data.debit,
      credit: data.credit,
      account: data.account,
      status: data.status,
      userId: data.userId
    });
  });

  return entries;
};