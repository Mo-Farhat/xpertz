import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { LedgerEntry, DateRange } from '../../components/features/FinanceAndAccounting/GeneralLedger/types';

const fetchModuleEntries = async (
  userId: string,
  module: string,
  dateRange: DateRange,
  accountMapping: Record<string, { number: string; name: string }>
): Promise<LedgerEntry[]> => {
  const entries: LedgerEntry[] = [];
  
  const q = query(
    collection(db, `users/${userId}/transactions/${module}/entries`),
    where('date', '>=', Timestamp.fromDate(dateRange.from)),
    where('date', '<=', Timestamp.fromDate(dateRange.to)),
    orderBy('date', 'asc')
  );
  
  const snapshot = await getDocs(q);
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const account = accountMapping[data.type || 'default'];
    
    const entryDate = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
    
    entries.push({
      id: doc.id,
      date: entryDate,
      description: `${module}: ${data.reference || data.description}`,
      accountNumber: account.number,
      accountName: account.name,
      category: module,
      debit: data.type === 'debit' ? Number(data.amount) || 0 : 0,
      credit: data.type === 'credit' ? Number(data.amount) || 0 : 0,
      reference: data.reference || '',
      status: data.status || 'completed',
      module: { type: module, id: doc.id }
    });
  });

  return entries;
};

export const fetchLedgerEntries = async (userId: string, dateRange: DateRange): Promise<LedgerEntry[]> => {
  if (!userId) {
    throw new Error('User ID is required to fetch ledger entries');
  }

  const accountMappings = {
    AP: {
      default: { number: '2000', name: 'Accounts Payable' },
      invoice: { number: '2000', name: 'Accounts Payable' },
      payment: { number: '1000', name: 'Cash' }
    },
    AR: {
      default: { number: '1200', name: 'Accounts Receivable' },
      invoice: { number: '1200', name: 'Accounts Receivable' },
      payment: { number: '1000', name: 'Cash' }
    },
    Payroll: {
      default: { number: '5000', name: 'Payroll Expense' },
      salary: { number: '5000', name: 'Salary Expense' },
      tax: { number: '2100', name: 'Payroll Tax Payable' }
    },
    Inventory: {
      default: { number: '1300', name: 'Inventory Asset' },
      purchase: { number: '1300', name: 'Inventory Asset' },
      sale: { number: '5100', name: 'Cost of Goods Sold' }
    },
    FixedAssets: {
      default: { number: '1500', name: 'Fixed Assets' },
      asset: { number: '1500', name: 'Fixed Assets' },
      depreciation: { number: '5200', name: 'Depreciation Expense' }
    }
  };

  try {
    const modulePromises = ['AP', 'AR', 'Payroll', 'Inventory', 'FixedAssets'].map(module =>
      fetchModuleEntries(userId, module, dateRange, accountMappings[module])
    );

    const moduleEntries = await Promise.all(modulePromises);
    return moduleEntries.flat().sort((a, b) => a.date.getTime() - b.date.getTime());
  } catch (error) {
    console.error('Error fetching ledger entries:', error);
    throw new Error('Failed to fetch ledger entries');
  }
};