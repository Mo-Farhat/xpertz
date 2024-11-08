import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { ARInvoice } from './types';

interface ARMetricsProps {
  invoices: ARInvoice[];
}

export const calculateMetrics = (invoices: ARInvoice[]) => {
  const totalReceivables = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueReceivables = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingCount = invoices.filter(inv => inv.status === 'pending').length;
  
  return {
    totalReceivables,
    overdueReceivables,
    pendingCount,
    overduePercentage: totalReceivables ? (overdueReceivables / totalReceivables) * 100 : 0
  };
};

const ARMetrics: React.FC<ARMetricsProps> = ({ invoices }) => {
  const metrics = calculateMetrics(invoices);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Receivables</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${metrics.totalReceivables.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overdue Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">
            ${metrics.overdueReceivables.toFixed(2)}
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

export default ARMetrics;