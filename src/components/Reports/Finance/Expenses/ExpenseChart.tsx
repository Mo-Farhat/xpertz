import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ExpenseSummaryProps } from './types';

const ExpenseChart: React.FC<ExpenseSummaryProps> = ({ data }) => {
  const chartData = Object.entries(data.expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
    previousAmount: data.previousPeriodExpenses[category] || 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#0088FE" name="Current Period" />
              <Bar dataKey="previousAmount" fill="#82ca9d" name="Previous Period" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;