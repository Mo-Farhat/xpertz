import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';

export interface FinancialData {
  revenue: number;
  salesReturns: number;
  costOfGoodsSold: number;
  operatingExpenses: number;
  productSales: number;
  serviceRevenue: number;
  taxes: number;
  interest: number;
  grossProfit: number;
  operatingProfit: number;
  netProfit: number;
}

export const fetchIncomeStatementData = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<FinancialData> => {
  try {
    const [salesData, returnsData, cogsData, expensesData, taxesData] = await Promise.all([
      fetchSalesData(userId, startDate, endDate),
      fetchReturnsData(userId, startDate, endDate),
      fetchCOGSData(userId, startDate, endDate),
      fetchExpensesData(userId, startDate, endDate),
      fetchTaxAndInterestData(userId, startDate, endDate)
    ]);

    const revenue = salesData.productSales + salesData.serviceRevenue - returnsData;
    const grossProfit = revenue - cogsData;
    const operatingProfit = grossProfit - expensesData;
    const netProfit = operatingProfit - (taxesData.taxes + taxesData.interest);

    return {
      revenue,
      salesReturns: returnsData,
      costOfGoodsSold: cogsData,
      operatingExpenses: expensesData,
      productSales: salesData.productSales,
      serviceRevenue: salesData.serviceRevenue,
      taxes: taxesData.taxes,
      interest: taxesData.interest,
      grossProfit,
      operatingProfit,
      netProfit
    };
  } catch (error) {
    console.error('Error fetching income statement data:', error);
    throw error;
  }
};

const fetchSalesData = async (userId: string, startDate: Date, endDate: Date) => {
  const salesRef = collection(db, `users/${userId}/sales`);
  const q = query(
    salesRef,
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate))
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.reduce((acc, doc) => {
    const data = doc.data();
    if (data.type === 'product') {
      acc.productSales += data.amount;
    } else {
      acc.serviceRevenue += data.amount;
    }
    return acc;
  }, { productSales: 0, serviceRevenue: 0 });
};

const fetchReturnsData = async (userId: string, startDate: Date, endDate: Date) => {
  const returnsRef = collection(db, `users/${userId}/returns`);
  const q = query(
    returnsRef,
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate))
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
};

const fetchCOGSData = async (userId: string, startDate: Date, endDate: Date) => {
  const cogsRef = collection(db, `users/${userId}/inventory`);
  const q = query(
    cogsRef,
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate)),
    where('type', '==', 'cogs')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
};

const fetchExpensesData = async (userId: string, startDate: Date, endDate: Date) => {
  const expensesRef = collection(db, `users/${userId}/expenses`);
  const q = query(
    expensesRef,
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate)),
    where('type', '==', 'operating')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
};

const fetchTaxAndInterestData = async (userId: string, startDate: Date, endDate: Date) => {
  const taxesRef = collection(db, `users/${userId}/expenses`);
  const q = query(
    taxesRef,
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate)),
    where('type', 'in', ['tax', 'interest'])
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.reduce((acc, doc) => {
    const data = doc.data();
    if (data.type === 'tax') {
      acc.taxes += data.amount;
    } else {
      acc.interest += data.amount;
    }
    return acc;
  }, { taxes: 0, interest: 0 });
};