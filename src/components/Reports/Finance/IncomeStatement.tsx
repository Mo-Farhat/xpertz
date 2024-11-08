import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useToast } from "../../hooks/use-toast";
import { fetchIncomeStatementData, FinancialData } from '../../services/reports/incomeStatementService';
import IncomeStatementMetrics from './IncomeStatement/IncomeStatementMetrics';
import IncomeStatementSummary from './IncomeStatement/IncomeStatementSummary';

const IncomeStatement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [currentPeriodData, setCurrentPeriodData] = useState<FinancialData>({
    revenue: 0,
    salesReturns: 0,
    costOfGoodsSold: 0,
    operatingExpenses: 0,
    productSales: 0,
    serviceRevenue: 0,
    taxes: 0,
    interest: 0,
    grossProfit: 0,
    operatingProfit: 0,
    netProfit: 0
  });
  const [previousPeriodData, setPreviousPeriodData] = useState<FinancialData>({
    revenue: 0,
    salesReturns: 0,
    costOfGoodsSold: 0,
    operatingExpenses: 0,
    productSales: 0,
    serviceRevenue: 0,
    taxes: 0,
    interest: 0,
    grossProfit: 0,
    operatingProfit: 0,
    netProfit: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;

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

        const [current, previous] = await Promise.all([
          fetchIncomeStatementData(user.uid, currentStartDate, now),
          fetchIncomeStatementData(user.uid, previousStartDate, currentStartDate)
        ]);

        setCurrentPeriodData(current);
        setPreviousPeriodData(previous);
      } catch (error) {
        console.error('Error fetching income statement data:', error);
        toast({
          title: "Error",
          description: "Failed to load income statement data",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [user, timeRange, toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Income Statement</h3>
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

      <IncomeStatementMetrics
        currentPeriodData={currentPeriodData}
        previousPeriodData={previousPeriodData}
      />

      <IncomeStatementSummary data={currentPeriodData} />
    </div>
  );
};

export default IncomeStatement;