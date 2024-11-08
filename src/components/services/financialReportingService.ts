import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export interface FinancialData {
  revenue: number;
  expenses: number;
  assets: number;
  liabilities: number;
  cashFromOperations: number;
  cashFromInvesting: number;
  cashFromFinancing: number;
  netCashFlow: number;
}

export const fetchFinancialData = async (
  startDate: Date,
  endDate: Date
): Promise<FinancialData> => {
  try {
    // Revenue from accountsReceivable
    const revenueQuery = query(
      collection(db, 'accountsReceivable'),
      where('dueDate', '>=', Timestamp.fromDate(startDate)),
      where('dueDate', '<=', Timestamp.fromDate(endDate)),
      where('status', '==', 'paid')
    );

    // Expenses from accountsPayable
    const expensesQuery = query(
      collection(db, 'accountsPayable'),
      where('dueDate', '>=', Timestamp.fromDate(startDate)),
      where('dueDate', '<=', Timestamp.fromDate(endDate))
    );

    // Assets collection
    const assetsQuery = query(collection(db, 'assets'));

    // Bank transactions for cash flow
    const bankTransactionsQuery = query(
      collection(db, 'bankTransactions'),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate))
    );

    // Fetch all data in parallel
    const [
      revenueSnapshot,
      expensesSnapshot,
      assetsSnapshot,
      bankTransactionsSnapshot
    ] = await Promise.all([
      getDocs(revenueQuery),
      getDocs(expensesQuery),
      getDocs(assetsQuery),
      getDocs(bankTransactionsQuery)
    ]);

    // Calculate totals
    const revenue = revenueSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
    const expenses = expensesSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
    const assets = assetsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().value || 0), 0);
    
    // Calculate cash flows from bank transactions
    const bankTransactions = bankTransactionsSnapshot.docs.map(doc => ({
      type: doc.data().type,
      amount: doc.data().amount || 0
    }));

    const cashFromOperations = bankTransactions
      .filter(t => t.type === 'operating')
      .reduce((sum, t) => sum + t.amount, 0);

    const cashFromInvesting = bankTransactions
      .filter(t => t.type === 'investing')
      .reduce((sum, t) => sum + t.amount, 0);

    const cashFromFinancing = bankTransactions
      .filter(t => t.type === 'financing')
      .reduce((sum, t) => sum + t.amount, 0);

    const netCashFlow = cashFromOperations + cashFromInvesting + cashFromFinancing;
    const liabilities = expensesSnapshot.docs
      .filter(doc => doc.data().status !== 'paid')
      .reduce((sum, doc) => sum + (doc.data().amount || 0), 0);

    return {
      revenue,
      expenses,
      assets,
      liabilities,
      cashFromOperations,
      cashFromInvesting,
      cashFromFinancing,
      netCashFlow
    };
  } catch (error) {
    console.error('Error fetching financial data:', error);
    throw error;
  }
};