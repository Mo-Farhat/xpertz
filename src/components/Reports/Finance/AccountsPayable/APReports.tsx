import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { APSummaryMetrics } from './APSummaryMetrics';
import { APAgingTable } from './APAgingTable';
import { APVendorChart } from './APVendorChart.tsx';
import { Invoice } from './components/features/FinanceAndAccounting/AccountsPayable/types';

interface APReportsProps {
  invoices: Invoice[];
}

const APReports: React.FC<APReportsProps> = ({ invoices }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Accounts Payable Reports</h2>
        <Select value={timeRange} onValueChange={(value: 'week' | 'month' | 'quarter') => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <APSummaryMetrics invoices={invoices} timeRange={timeRange} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aging Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <APAgingTable invoices={invoices} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payables by Vendor</CardTitle>
          </CardHeader>
          <CardContent>
            <APVendorChart invoices={invoices} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APReports;