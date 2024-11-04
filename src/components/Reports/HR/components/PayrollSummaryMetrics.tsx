import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { PayrollData } from '../types';
interface PayrollSummaryMetricsProps {
  data: PayrollData;
}
const PayrollSummaryMetrics: React.FC<PayrollSummaryMetricsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${data.totalPayroll.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Employee Count</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.employeeCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Salary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${data.averageSalary.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${data.benefits.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
};
export default PayrollSummaryMetrics;