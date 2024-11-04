import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { PayrollData } from '../types';
interface PayrollBreakdownTableProps {
  data: PayrollData;
}
const PayrollBreakdownTable: React.FC<PayrollBreakdownTableProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>% of Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Base Salary</TableCell>
              <TableCell>${(data.totalPayroll - data.benefits - data.taxes - data.overtime - data.bonuses).toFixed(2)}</TableCell>
              <TableCell>
                {((data.totalPayroll - data.benefits - data.taxes - data.overtime - data.bonuses) / data.totalPayroll * 100).toFixed(1)}%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Benefits</TableCell>
              <TableCell>${data.benefits.toFixed(2)}</TableCell>
              <TableCell>{((data.benefits / data.totalPayroll) * 100).toFixed(1)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Taxes</TableCell>
              <TableCell>${data.taxes.toFixed(2)}</TableCell>
              <TableCell>{((data.taxes / data.totalPayroll) * 100).toFixed(1)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Overtime</TableCell>
              <TableCell>${data.overtime.toFixed(2)}</TableCell>
              <TableCell>{((data.overtime / data.totalPayroll) * 100).toFixed(1)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bonuses</TableCell>
              <TableCell>${data.bonuses.toFixed(2)}</TableCell>
              <TableCell>{((data.bonuses / data.totalPayroll) * 100).toFixed(1)}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="mt-6">
          <h4 className="font-semibold mb-4">Department Breakdown</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(data.departmentBreakdown).map(([department, amount]) => (
                <TableRow key={department}>
                  <TableCell>{department}</TableCell>
                  <TableCell>${amount.toFixed(2)}</TableCell>
                  <TableCell>{((amount / data.totalPayroll) * 100).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
export default PayrollBreakdownTable;