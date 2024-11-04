import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { AccountEntry } from './types';
import { format } from 'date-fns';

interface AgingTableProps {
  title: string;
  accounts: AccountEntry[];
}

const AgingTable: React.FC<AgingTableProps> = ({ title, accounts }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{title}</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>0-30 Days</TableHead>
            <TableHead>31-60 Days</TableHead>
            <TableHead>61-90 Days</TableHead>
            <TableHead>90+ Days</TableHead>
            <TableHead>Last Payment</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>{account.name}</TableCell>
              <TableCell>${account.total.toFixed(2)}</TableCell>
              {account.brackets.map((bracket, index) => (
                <TableCell key={index}>
                  ${bracket.amount.toFixed(2)}
                  <span className="text-xs text-gray-500 ml-1">
                    ({bracket.percentage.toFixed(1)}%)
                  </span>
                </TableCell>
              ))}
              <TableCell>{format(account.lastPaymentDate, 'MMM d, yyyy')}</TableCell>
              <TableCell>
                <Badge variant={account.status === 'current' ? 'default' : 'destructive'}>
                  {account.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgingTable;