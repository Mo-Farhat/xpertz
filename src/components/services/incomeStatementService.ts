import { fetchRevenueData, calculateRevenueMetrics } from './revenueTrackingService';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export interface IncomeStatementData {
  revenue: {
    productSales: number;
    serviceRevenue: number;
    otherIncome: number;
    total: number;
  };
  expenses: {
    costOfGoodsSold: number;
    operatingExpenses: number;
    payrollExpenses: number;
    marketingExpenses: number;
    administrativeExpenses: number;
    total: number;
  };
  profitability: {
    grossProfit: number;
    operatingProfit: number;
    netProfit: number;
    profitMargin: number;
  };
  comparisons: {
    previousPeriodRevenue: number;
    previousPeriodExpenses: number;
    previousPeriodProfit: number;
    revenueGrowth: number;
    profitGrowth: number;
  };
}

export const fetchIncomeStatementData = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<IncomeStatementData> => {
  // Fetch revenue data using the new revenue tracking service
  const revenueData = await fetchRevenueData(startDate, endDate);
  const revenueMetrics = calculateRevenueMetrics(revenueData);

  // Fetch expenses data
  const expensesQuery = query(
    collection(db, `users/${userId}/expenses`),
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate))
  );
  
  const expensesDocs = await getDocs(expensesQuery);
  const expenses = expensesDocs.docs.reduce((acc, doc) => {
    const data = doc.data();
    switch (data.category) {
      case 'cogs':
        acc.costOfGoodsSold += data.amount;
        break;
      case 'operating':
        acc.operatingExpenses += data.amount;
        break;
      case 'payroll':
        acc.payrollExpenses += data.amount;
        break;
      case 'marketing':
        acc.marketingExpenses += data.amount;
        break;
      case 'administrative':
        acc.administrativeExpenses += data.amount;
        break;
    }
    acc.total += data.amount;
    return acc;
  }, {
    costOfGoodsSold: 0,
    operatingExpenses: 0,
    payrollExpenses: 0,
    marketingExpenses: 0,
    administrativeExpenses: 0,
    total: 0
  });

  const grossProfit = revenueMetrics.totalRevenue - expenses.costOfGoodsSold;
  const operatingProfit = grossProfit - expenses.operatingExpenses;
  const netProfit = operatingProfit * 0.85; // Assuming 15% tax rate
  const profitMargin = (netProfit / revenueMetrics.totalRevenue) * 100;

  return {
    revenue: {
      productSales: revenueMetrics.salesRevenue,
      serviceRevenue: revenueMetrics.serviceRevenue,
      otherIncome: revenueMetrics.otherRevenue,
      total: revenueMetrics.totalRevenue
    },
    expenses,
    profitability: {
      grossProfit,
      operatingProfit,
      netProfit,
      profitMargin
    },
    comparisons: {
      previousPeriodRevenue: revenueMetrics.periodComparison.previousPeriod,
      previousPeriodExpenses: expenses.total,
      previousPeriodProfit: revenueMetrics.periodComparison.previousPeriod - expenses.total,
      revenueGrowth: revenueMetrics.periodComparison.percentageChange,
      profitGrowth: ((netProfit - (revenueMetrics.periodComparison.previousPeriod - expenses.total)) / 
        (revenueMetrics.periodComparison.previousPeriod - expenses.total)) * 100
    }
  };
};