import React from 'react';
import { PayrollRecord } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';

interface PayrollTableProps {
  records: PayrollRecord[];
  isLoading: boolean;
}

const PayrollTable: React.FC<PayrollTableProps> = ({ records, isLoading }) => {
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading payroll records...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Records</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-6 text-left">Employee Name</th>
                <th className="py-3 px-6 text-left">Pay Period</th>
                <th className="py-3 px-6 text-right">Base Salary</th>
                <th className="py-3 px-6 text-right">Overtime Pay</th>
                <th className="py-3 px-6 text-right">Benefits</th>
                <th className="py-3 px-6 text-right">Deductions</th>
                <th className="py-3 px-6 text-right">Net Salary</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b">
                  <td className="py-3 px-6 text-left font-medium">{record.employeeName}</td>
                  <td className="py-3 px-6 text-left">{record.payPeriod}</td>
                  <td className="py-3 px-6 text-right">${record.basicSalary.toFixed(2)}</td>
                  <td className="py-3 px-6 text-right">${record.overtime.toFixed(2)}</td>
                  <td className="py-3 px-6 text-right">${record.benefits?.toFixed(2) || '0.00'}</td>
                  <td className="py-3 px-6 text-right">${record.deductions.toFixed(2)}</td>
                  <td className="py-3 px-6 text-right font-semibold">${record.netSalary.toFixed(2)}</td>
                  <td className="py-3 px-6 text-center">
                    <Badge variant={record.status === 'paid' ? 'default' : 'secondary'}>
                      {record.status === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-muted-foreground">
                    No payroll records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollTable;