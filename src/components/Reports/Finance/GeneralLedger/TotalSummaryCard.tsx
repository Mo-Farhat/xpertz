import React from 'react';
import { Card, CardContent } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { CategorySummary } from './types';

interface TotalSummaryCardProps {
  categorySummaries: CategorySummary[];
}

const TotalSummaryCard = ({ categorySummaries }: TotalSummaryCardProps) => {
  return (
    <Card>
      <CardContent className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Overall Total</TableHead>
              <TableHead className="text-right">Total Debits</TableHead>
              <TableHead className="text-right">Total Credits</TableHead>
              <TableHead className="text-right">Net Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="font-bold">
              <TableCell>All Categories</TableCell>
              <TableCell className="text-right">
                {categorySummaries.reduce((sum, cat) => sum + cat.totalDebits, 0).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {categorySummaries.reduce((sum, cat) => sum + cat.totalCredits, 0).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {categorySummaries.reduce((sum, cat) => sum + cat.balance, 0).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TotalSummaryCard;