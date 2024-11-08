import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { TrendingDown, TrendingUp } from 'lucide-react';
import { ExpenseSummaryProps } from './types';

const ExpenseSummaryMetrics: React.FC<ExpenseSummaryProps> = ({ data }) => {
  const totalPreviousPeriod = Object.values(data.previousPeriodExpenses).reduce((a, b) => a + b, 0);
  const percentageChange = ((data.totalExpenses - totalPreviousPeriod) / totalPreviousPeriod) * 100;

  const largestCategory = Object.entries(data.expensesByCategory)
    .sort(([, a], [, b]) => b - a)[0];

  const biggestChange = Object.entries(data.changeFromPrevious)
    .sort(([, a], [, b]) => Math.abs(b.percentage) - Math.abs(a.percentage))[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          {largestCategory && (
            <>
              <p className="text-lg font-medium">{largestCategory[0]}</p>
              <p className="text-2xl font-bold">${largestCategory[1].toFixed(2)}</p>
              <p className="text-sm text-gray-500">
                {((largestCategory[1] / data.totalExpenses) * 100).toFixed(1)}% of total
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Biggest Change</CardTitle>
        </CardHeader>
        <CardContent>
          {biggestChange && (
            <>
              <p className="text-lg font-medium">{biggestChange[0]}</p>
              <div className="flex items-center">
                {biggestChange[1].percentage > 0 ? (
                  <TrendingUp className="text-red-500 mr-2" />
                ) : (
                  <TrendingDown className="text-green-500 mr-2" />
                )}
                <span className={biggestChange[1].percentage > 0 ? "text-red-500" : "text-green-500"}>
                  {Math.abs(biggestChange[1].percentage).toFixed(1)}%
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseSummaryMetrics;