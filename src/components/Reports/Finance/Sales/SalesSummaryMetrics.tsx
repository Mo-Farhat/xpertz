import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { SalesSummary } from './types';

interface SalesSummaryMetricsProps {
  data: SalesSummary;
}

const SalesSummaryMetrics: React.FC<SalesSummaryMetricsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${data.totalSales.toFixed(2)}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Average Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${data.averageTransaction.toFixed(2)}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Total Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.topCustomers.length}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesSummaryMetrics;