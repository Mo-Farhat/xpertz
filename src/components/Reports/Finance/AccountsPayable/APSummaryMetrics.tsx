import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Invoice } from '@/components/features/FinanceAndAccounting/AccountsPayable/types';

interface APSummaryMetricsProps {
  invoices: Invoice[];
  timeRange: 'week' | 'month' | 'quarter';
}

export const APSummaryMetrics: React.FC<APSummaryMetricsProps> = ({ invoices, timeRange }) => {
  const calculateMetrics = () => {
    const totalPayables = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const overduePayables = invoices
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const pendingCount = invoices.filter(inv => inv.status === 'pending').length;
    
    return {
      totalPayables,
      overduePayables,
      pendingCount,
      overduePercentage: totalPayables ? (overduePayables / totalPayables) * 100 : 0
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Payables</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${metrics.totalPayables.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overdue Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">
            ${metrics.overduePayables.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{metrics.pendingCount}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overdue Percentage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{metrics.overduePercentage.toFixed(1)}%</p>
        </CardContent>
      </Card>
    </div>
  );
};