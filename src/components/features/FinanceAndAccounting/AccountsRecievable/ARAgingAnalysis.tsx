import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { ARInvoice } from './types';

interface ARAgingAnalysisProps {
  invoices: ARInvoice[];
}

export const calculateAging = (invoices: ARInvoice[]) => {
  const now = new Date();
  const aging = {
    current: { count: 0, amount: 0 },
    '1-30': { count: 0, amount: 0 },
    '31-60': { count: 0, amount: 0 },
    '61-90': { count: 0, amount: 0 },
    '90+': { count: 0, amount: 0 }
  };

  invoices.forEach(invoice => {
    const daysDiff = Math.floor((now.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 0) {
      aging.current.count++;
      aging.current.amount += invoice.amount;
    } else if (daysDiff <= 30) {
      aging['1-30'].count++;
      aging['1-30'].amount += invoice.amount;
    } else if (daysDiff <= 60) {
      aging['31-60'].count++;
      aging['31-60'].amount += invoice.amount;
    } else if (daysDiff <= 90) {
      aging['61-90'].count++;
      aging['61-90'].amount += invoice.amount;
    } else {
      aging['90+'].count++;
      aging['90+'].amount += invoice.amount;
    }
  });

  return aging;
};

const ARAgingAnalysis: React.FC<ARAgingAnalysisProps> = ({ invoices }) => {
  const agingData = calculateAging(invoices);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aging Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Age</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(agingData).map(([period, data]) => (
              <TableRow key={period}>
                <TableCell>{period}</TableCell>
                <TableCell className="text-right">{data.count}</TableCell>
                <TableCell className="text-right">${data.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ARAgingAnalysis;