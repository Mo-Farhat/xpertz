import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { ExpenseSummary } from './types';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface ExpenseSummaryMetricsProps {
  data: ExpenseSummary;
}

const ExpenseSummaryMetrics: React.FC<ExpenseSummaryMetricsProps> = ({ data }) => {
  const totalPreviousPeriod = Object.values(data.previousPeriodExpenses).reduce((a, b) => a + b, 0);
  const percentageChange = ((data.totalExpenses - totalPreviousPeriod) / totalPreviousPeriod) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${data.totalExpenses.toFixed(2)}</p>
          <div className="flex items-center mt-2">
            {percentageChange > 0 ? (
              <TrendingUp className="text-red-500 mr-2" />
            ) : (
              <TrendingDown className="text-green-500 mr-2" />
            )}
            <span className={percentageChange > 0 ? "text-red-500" : "text-green-500"}>
              {Math.abs(percentageChange).toFixed(1)}% from previous period
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Largest Category</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(data.expensesByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 1)
            .map(([category, amount]) => (
              <div key={category}>
                <p className="text-lg font-medium">{category}</p>
                <p className="text-2xl font-bold">${amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  {((amount / data.totalExpenses) * 100).toFixed(1)}% of total
                </p>
              </div>
            ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Biggest Change</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(data.changeFromPrevious)
            .sort(([, a], [, b]) => Math.abs(b.percentage) - Math.abs(a.percentage))
            .slice(0, 1)
            .map(([category, { percentage }]) => (
              <div key={category}>
                <p className="text-lg font-medium">{category}</p>
                <div className="flex items-center">
                  {percentage > 0 ? (
                    <TrendingUp className="text-red-500 mr-2" />
                  ) : (
                    <TrendingDown className="text-green-500 mr-2" />
                  )}
                  <span className={percentage > 0 ? "text-red-500" : "text-green-500"}>
                    {Math.abs(percentage).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseSummaryMetrics;