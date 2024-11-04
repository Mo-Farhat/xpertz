import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { BudgetItem } from './types';

interface BudgetComparisonTableProps {
  title: string;
  items: BudgetItem[];
}

const BudgetComparisonTable: React.FC<BudgetComparisonTableProps> = ({ title, items }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{title}</TableHead>
            <TableHead>Budgeted</TableHead>
            <TableHead>Actual</TableHead>
            <TableHead>Variance</TableHead>
            <TableHead>Variance %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.category}</TableCell>
              <TableCell>${item.budgeted.toFixed(2)}</TableCell>
              <TableCell>${item.actual.toFixed(2)}</TableCell>
              <TableCell>
                <span className={item.variance >= 0 ? "text-green-600" : "text-red-600"}>
                  ${item.variance.toFixed(2)}
                </span>
              </TableCell>
              <TableCell>
                <span className={item.variancePercentage >= 0 ? "text-green-600" : "text-red-600"}>
                  {item.variancePercentage.toFixed(1)}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BudgetComparisonTable;