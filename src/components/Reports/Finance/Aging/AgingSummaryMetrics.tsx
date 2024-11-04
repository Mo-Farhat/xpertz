import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { AgingData } from './types';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface AgingSummaryMetricsProps {
  data: AgingData;
}

const AgingSummaryMetrics: React.FC<AgingSummaryMetricsProps> = ({ data }) => {
  const overdueReceivables = data.receivables.accounts.filter(a => a.status === 'overdue')
    .reduce((sum, account) => sum + account.total, 0);
  const overduePayables = data.payables.accounts.filter(a => a.status === 'overdue')
    .reduce((sum, account) => sum + account.total, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Receivables</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${data.receivables.total.toFixed(2)}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="text-red-500 mr-2" />
            <span className="text-red-500">
              ${overdueReceivables.toFixed(2)} overdue
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Total Payables</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${data.payables.total.toFixed(2)}</p>
          <div className="flex items-center mt-2">
            <TrendingDown className="text-red-500 mr-2" />
            <span className="text-red-500">
              ${overduePayables.toFixed(2)} overdue
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Net Position</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${(data.receivables.total - data.payables.total).toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgingSummaryMetrics;