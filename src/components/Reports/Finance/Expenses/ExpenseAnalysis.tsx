import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useTenant } from '../../../../contexts/TenantContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { useToast } from "../../../hooks/use-toast";
import { ExpenseData, ExpenseSummary } from './types';
import ExpenseSummaryMetrics from './ExpenseSummaryMetrics';
import ExpenseChart from './ExpenseChart';
import CategoryDetails from './CategoryDetails';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ExpenseAnalysis = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [expenseData, setExpenseData] = useState<ExpenseSummary>({
    totalExpenses: 0,
    expensesByCategory: {},
    previousPeriodExpenses: {},
    percentageOfRevenue: {},
    changeFromPrevious: {}
  });

  useEffect(() => {
    const fetchExpenseData = async () => {
      if (!tenant?.id) return;

      try {
        const now = new Date();
        let currentStartDate = new Date();
        let previousStartDate = new Date();

        switch (timeRange) {
          case 'month':
            currentStartDate.setMonth(now.getMonth() - 1);
            previousStartDate.setMonth(now.getMonth() - 2);
            break;
          case 'quarter':
            currentStartDate.setMonth(now.getMonth() - 3);
            previousStartDate.setMonth(now.getMonth() - 6);
            break;
          case 'year':
            currentStartDate.setFullYear(now.getFullYear() - 1);
            previousStartDate.setFullYear(now.getFullYear() - 2);
            break;
        }

        const [currentExpenses, previousExpenses] = await Promise.all([
          getDocs(query(
            collection(db, `tenants/${tenant.id}/expenses`),
            where('date', '>=', Timestamp.fromDate(currentStartDate)),
            where('date', '<=', Timestamp.fromDate(now))
          )),
          getDocs(query(
            collection(db, `tenants/${tenant.id}/expenses`),
            where('date', '>=', Timestamp.fromDate(previousStartDate)),
            where('date', '<', Timestamp.fromDate(currentStartDate))
          ))
        ]);

        const currentPeriodData = currentExpenses.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ExpenseData[];

        const previousPeriodData = previousExpenses.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ExpenseData[];

        const summary = calculateExpenseSummary(currentPeriodData, previousPeriodData);
        setExpenseData(summary);
      } catch (error) {
        console.error('Error fetching expense data:', error);
        toast({
          title: "Error",
          description: "Failed to load expense data",
          variant: "destructive",
        });
      }
    };

    fetchExpenseData();
  }, [tenant, timeRange, toast]);

  const calculateExpenseSummary = (currentData: ExpenseData[], previousData: ExpenseData[]): ExpenseSummary => {
    const summary: ExpenseSummary = {
      totalExpenses: currentData.reduce((sum, expense) => sum + expense.amount, 0),
      expensesByCategory: {},
      previousPeriodExpenses: {},
      percentageOfRevenue: {},
      changeFromPrevious: {}
    };

    // Calculate current period expenses by category
    currentData.forEach(expense => {
      summary.expensesByCategory[expense.category] = (summary.expensesByCategory[expense.category] || 0) + expense.amount;
    });

    // Calculate previous period expenses by category
    previousData.forEach(expense => {
      summary.previousPeriodExpenses[expense.category] = (summary.previousPeriodExpenses[expense.category] || 0) + expense.amount;
    });

    // Calculate changes from previous period
    Object.keys(summary.expensesByCategory).forEach(category => {
      const currentAmount = summary.expensesByCategory[category] || 0;
      const previousAmount = summary.previousPeriodExpenses[category] || 0;
      const change = currentAmount - previousAmount;
      const percentage = previousAmount ? (change / previousAmount) * 100 : 100;

      summary.changeFromPrevious[category] = {
        amount: change,
        percentage: percentage
      };
    });

    return summary;
  };

  const chartData = Object.entries(expenseData.expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / expenseData.totalExpenses) * 100
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Expense Analysis</h3>
        <Select value={timeRange} onValueChange={(value: 'month' | 'quarter' | 'year') => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="quarter">Quarterly</SelectItem>
            <SelectItem value="year">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ExpenseSummaryMetrics data={expenseData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseChart chartData={chartData} colors={COLORS} />
        <CategoryDetails 
          categories={expenseData.expensesByCategory}
          totalExpenses={expenseData.totalExpenses}
          colors={COLORS}
        />
      </div>
    </div>
  );
};

export default ExpenseAnalysis;