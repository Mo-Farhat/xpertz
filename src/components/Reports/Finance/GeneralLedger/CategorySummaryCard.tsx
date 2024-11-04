import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { CategorySummary } from './types';

interface CategorySummaryCardProps {
  category: CategorySummary;
}

const CategorySummaryCard = ({ category }: CategorySummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.category}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account Number</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead className="text-right">Total Debits</TableHead>
              <TableHead className="text-right">Total Credits</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {category.accounts.map((account) => (
              <TableRow key={`${account.accountNumber}-${account.accountName}`}>
                <TableCell>{account.accountNumber}</TableCell>
                <TableCell>{account.accountName}</TableCell>
                <TableCell className="text-right">{account.totalDebits.toFixed(2)}</TableCell>
                <TableCell className="text-right">{account.totalCredits.toFixed(2)}</TableCell>
                <TableCell className="text-right">{account.balance.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold">
              <TableCell colSpan={2}>Category Total</TableCell>
              <TableCell className="text-right">{category.totalDebits.toFixed(2)}</TableCell>
              <TableCell className="text-right">{category.totalCredits.toFixed(2)}</TableCell>
              <TableCell className="text-right">{category.balance.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CategorySummaryCard;