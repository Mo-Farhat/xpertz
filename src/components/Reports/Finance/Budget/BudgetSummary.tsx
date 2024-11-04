import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { BudgetData } from './types';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface BudgetSummaryProps {
  data: BudgetData;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ data }) => {
  const { summary } = data;
  const incomeVariance = summary.totalActualIncome - summary.totalBudgetedIncome;
  const incomeVariancePercentage = (incomeVariance / summary.totalBudgetedIncome) * 100;
  const expenseVariance = summary.totalActualExpenses - summary.totalBudgetedExpenses;
  const expenseVariancePercentage = (expenseVariance / summary.totalBudgetedExpenses) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Income Variance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${incomeVariance.toFixed(2)}</p>
          <div className="flex items-center mt-2">
            {incomeVariance >= 0 ? (
              <TrendingUp className="text-green-500 mr-2" />
            ) : (
              <TrendingDown className="text-red-500 mr-2" />
            )}
            <span className={incomeVariance >= 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(incomeVariancePercentage).toFixed(1)}% from budget
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Variance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${expenseVariance.toFixed(2)}</p>
          <div className="flex items-center mt-2">
            {expenseVariance <= 0 ? (
              <TrendingDown className="text-green-500 mr-2" />
            ) : (
              <TrendingUp className="text-red-500 mr-2" />
            )}
            <span className={expenseVariance <= 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(expenseVariancePercentage).toFixed(1)}% from budget
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Income Variance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${(summary.netActualIncome - summary.netBudgetedIncome).toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;