import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { FinancialData } from '../../../services/reports/incomeStatementService';

interface IncomeStatementMetricsProps {
  currentPeriodData: FinancialData;
  previousPeriodData: FinancialData;
}

const IncomeStatementMetrics: React.FC<IncomeStatementMetricsProps> = ({
  currentPeriodData,
  previousPeriodData
}) => {
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
  );
};

export default IncomeStatementMetrics;