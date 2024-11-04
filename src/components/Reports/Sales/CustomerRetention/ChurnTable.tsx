import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";

interface ChurnTableProps {
  data: Array<{
    period: string;
    totalCustomers: number;
    activeCustomers: number;
    churnedCustomers: number;
    retentionRate: number;
    churnRate: number;
  }>;
}

const ChurnTable: React.FC<ChurnTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead className="text-right">Total Customers</TableHead>
            <TableHead className="text-right">Active</TableHead>
            <TableHead className="text-right">Churned</TableHead>
            <TableHead className="text-right">Churn Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((period, index) => (
            <TableRow key={index}>
              <TableCell>{period.period}</TableCell>
              <TableCell className="text-right">{period.totalCustomers}</TableCell>
              <TableCell className="text-right">{period.activeCustomers}</TableCell>
              <TableCell className="text-right">{period.churnedCustomers}</TableCell>
              <TableCell className="text-right">
                {period.churnRate.toFixed(1)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ChurnTable;