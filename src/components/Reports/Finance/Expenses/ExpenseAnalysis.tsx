import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useToast } from "../../../hooks/use-toast";
import { ExpenseAnalysisData } from './types';
import ExpenseSummaryMetrics from './ExpenseSummaryMetrics';
import ExpenseChart from './ExpenseChart';
import CategoryDetails from './CategoryDetails';

const ExpenseAnalysis = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [expenseData, setExpenseData] = useState<ExpenseAnalysisData>({
    totalExpenses: 0,
    expensesByCategory: {},
    previousPeriodExpenses: {},
    changeFromPrevious: {},
    monthlyTrends: {}
  });

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const now = new Date();
        let startDate = new Date();
        let previousStartDate = new Date();

        switch (timeRange) {
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            previousStartDate.setMonth(now.getMonth() - 2);
            break;
          case 'quarter':
            startDate.setMonth(now.getMonth() - 3);
            previousStartDate.setMonth(now.getMonth() - 6);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            previousStartDate.setFullYear(now.getFullYear() - 2);
            break;
        }

        const [currentExpenses, previousExpenses] = await Promise.all([
          getDocs(query(
            collection(db, 'expenses'),
            where('date', '>=', Timestamp.fromDate(startDate)),
            where('date', '<=', Timestamp.fromDate(now))
          )),
          getDocs(query(
            collection(db, 'expenses'),
            where('date', '>=', Timestamp.fromDate(previousStartDate)),
            where('date', '<', Timestamp.fromDate(startDate))
          ))
        ]);

        const currentPeriodData = currentExpenses.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          date: doc.data().date.toDate()
        }));

        const previousPeriodData = previousExpenses.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          date: doc.data().date.toDate()
        }));

        // Calculate summaries
        const summary: ExpenseAnalysisData = {
          totalExpenses: currentPeriodData.reduce((sum, expense) => sum + expense.amount, 0),
          expensesByCategory: {},
          previousPeriodExpenses: {},
          changeFromPrevious: {},
          monthlyTrends: {}
        };

        // Calculate expenses by category
        currentPeriodData.forEach(expense => {
          summary.expensesByCategory[expense.category] = 
            (summary.expensesByCategory[expense.category] || 0) + expense.amount;
        });

        // Calculate previous period expenses
        previousPeriodData.forEach(expense => {
          summary.previousPeriodExpenses[expense.category] = 
            (summary.previousPeriodExpenses[expense.category] || 0) + expense.amount;
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

        setExpenseData(summary);
      } catch (error) {
        console.error('Error fetching expense data:', error);
        toast({
          title: "Error",
          description: "Failed to load expense analysis data",
          variant: "destructive",
        });
      }
    };

    fetchExpenseData();
  }, [timeRange, toast]);

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
        <ExpenseChart data={expenseData} />
        <CategoryDetails 
          categories={expenseData.expensesByCategory}
          totalExpenses={expenseData.totalExpenses}
        />
      </div>
    </div>
  );
};

export default ExpenseAnalysis;