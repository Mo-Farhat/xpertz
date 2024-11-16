import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
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
  grossProfit?: number;
  operatingIncome?: number;
  netIncome?: number;
}

export const fetchFinancialData = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<FinancialData> => {
  // Fetch sales data
  const salesQuery = query(
    collection(db, 'sales'),
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate))
  );
  const salesDocs = await getDocs(salesQuery);
  const revenue = salesDocs.docs.reduce((sum, doc) => sum + doc.data().total, 0);

  // Fetch expenses
  const expensesQuery = query(
    collection(db, 'expenses'),
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate))
  );
  const expensesDocs = await getDocs(expensesQuery);
  const expenses = expensesDocs.docs.reduce((sum, doc) => sum + doc.data().amount, 0);

  // Fetch assets
  const assetsQuery = query(collection(db, 'assets'));
  const assetsDocs = await getDocs(assetsQuery);
  const assets = assetsDocs.docs.reduce((sum, doc) => sum + doc.data().currentValue, 0);

  // Fetch liabilities
  const liabilitiesQuery = query(collection(db, 'liabilities'));
  const liabilitiesDocs = await getDocs(liabilitiesQuery);
  const liabilities = liabilitiesDocs.docs.reduce((sum, doc) => sum + doc.data().amount, 0);

  // Calculate cash flows
  const cashFromOperations = revenue - expenses;
  const cashFromInvesting = 0; // This would need to be calculated based on investment transactions
  const cashFromFinancing = 0; // This would need to be calculated based on financing activities
  const netCashFlow = cashFromOperations + cashFromInvesting + cashFromFinancing;

  // Calculate additional metrics
  const grossProfit = revenue * 0.7; // Assuming 30% COGS
  const operatingIncome = grossProfit - expenses;
  const netIncome = operatingIncome * 0.8; // Assuming 20% tax rate

  return {
    revenue,
    expenses,
    assets,
    liabilities,
    cashFromOperations,
    cashFromInvesting,
    cashFromFinancing,
    netCashFlow,
    grossProfit,
    operatingIncome,
    netIncome
  };
};