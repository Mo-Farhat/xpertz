import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface FinancialData {
  revenue: number;
  costOfGoodsSold: number;
  operatingExpenses: number;
  productSales: number;
  serviceRevenue: number;
}

const IncomeStatement = () => {
  const { tenant } = useTenant();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [currentPeriodData, setCurrentPeriodData] = useState<FinancialData>({
    revenue: 0,
    costOfGoodsSold: 0,
    operatingExpenses: 0,
    productSales: 0,
    serviceRevenue: 0
  });
  const [previousPeriodData, setPreviousPeriodData] = useState<FinancialData>({
    revenue: 0,
    costOfGoodsSold: 0,
    operatingExpenses: 0,
    productSales: 0,
    serviceRevenue: 0
  });

  useEffect(() => {
    const fetchFinancialData = async () => {
      if (!tenant) return;

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

      // Fetch current period data
      const currentQuery = query(
        collection(db, `tenants/${tenant.id}/finances`),
        where('date', '>=', Timestamp.fromDate(currentStartDate)),
        where('date', '<=', Timestamp.fromDate(now))
      );

      // Fetch previous period data
      const previousQuery = query(
        collection(db, `tenants/${tenant.id}/finances`),
        where('date', '>=', Timestamp.fromDate(previousStartDate)),
        where('date', '<', Timestamp.fromDate(currentStartDate))
      );

      const [currentSnapshot, previousSnapshot] = await Promise.all([
        getDocs(currentQuery),
        getDocs(previousQuery)
      ]);

      const processData = (snapshot: any) => {
        const data: FinancialData = {
          revenue: 0,
          costOfGoodsSold: 0,
          operatingExpenses: 0,
          productSales: 0,
          serviceRevenue: 0
        };

        snapshot.forEach((doc: any) => {
          const entry = doc.data();
          if (entry.type === 'revenue') {
            data.revenue += entry.amount;
            if (entry.category === 'product') {
              data.productSales += entry.amount;
            } else if (entry.category === 'service') {
              data.serviceRevenue += entry.amount;
            }
          } else if (entry.type === 'cogs') {
            data.costOfGoodsSold += entry.amount;
          } else if (entry.type === 'operating') {
            data.operatingExpenses += entry.amount;
          }
        });

        return data;
      };

      setCurrentPeriodData(processData(currentSnapshot));
      setPreviousPeriodData(processData(previousSnapshot));
    };

    fetchFinancialData();
  }, [tenant, timeRange]);

  const calculateGrossProfit = (data: FinancialData) => {
    return data.revenue - data.costOfGoodsSold;
  };

  const calculateNetProfit = (data: FinancialData) => {
    return calculateGrossProfit(data) - data.operatingExpenses;
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Income Statement</h3>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Product Sales</span>
                <span className="font-semibold">
                  ${currentPeriodData.productSales.toFixed(2)}
                  <span className="text-sm text-gray-500 ml-2">
                    ({calculatePercentageChange(
                      currentPeriodData.productSales,
                      previousPeriodData.productSales
                    ).toFixed(1)}%)
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Service Revenue</span>
                <span className="font-semibold">
                  ${currentPeriodData.serviceRevenue.toFixed(2)}
                  <span className="text-sm text-gray-500 ml-2">
                    ({calculatePercentageChange(
                      currentPeriodData.serviceRevenue,
                      previousPeriodData.serviceRevenue
                    ).toFixed(1)}%)
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Gross Profit</span>
                <span className="font-semibold">
                  ${calculateGrossProfit(currentPeriodData).toFixed(2)}
                  <span className="text-sm text-gray-500 ml-2">
                    ({calculatePercentageChange(
                      calculateGrossProfit(currentPeriodData),
                      calculateGrossProfit(previousPeriodData)
                    ).toFixed(1)}%)
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Net Profit</span>
                <span className="font-semibold">
                  ${calculateNetProfit(currentPeriodData).toFixed(2)}
                  <span className="text-sm text-gray-500 ml-2">
                    ({calculatePercentageChange(
                      calculateNetProfit(currentPeriodData),
                      calculateNetProfit(previousPeriodData)
                    ).toFixed(1)}%)
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">${currentPeriodData.revenue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cost of Goods Sold</p>
                <p className="text-2xl font-bold">${currentPeriodData.costOfGoodsSold.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Operating Expenses</p>
                <p className="text-2xl font-bold">${currentPeriodData.operatingExpenses.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Net Profit</p>
                <p className="text-2xl font-bold">${calculateNetProfit(currentPeriodData).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeStatement;