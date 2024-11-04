import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

interface RetentionMetricsProps {
  data: Array<{
    totalCustomers: number;
    activeCustomers: number;
    churnedCustomers: number;
    retentionRate: number;
    churnRate: number;
  }>;
}

const RetentionMetrics: React.FC<RetentionMetricsProps> = ({ data }) => {
  const latestPeriod = data[data.length - 1];
  const averageRetention = data.reduce((sum, item) => sum + item.retentionRate, 0) / data.length;
  const averageChurn = data.reduce((sum, item) => sum + item.churnRate, 0) / data.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {latestPeriod?.activeCustomers}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Retention Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {averageRetention.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Churn Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {averageChurn.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lost Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {latestPeriod?.churnedCustomers}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetentionMetrics;