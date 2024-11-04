import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { format } from 'date-fns';
import { LedgerEntry } from './types';

interface LedgerTableProps {
  entries: LedgerEntry[];
}

const LedgerTable = ({ entries }: LedgerTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Account Number</TableHead>
            <TableHead>Account Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Debit</TableHead>
            <TableHead className="text-right">Credit</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{format(entry.date, 'yyyy-MM-dd')}</TableCell>
              <TableCell>{entry.accountNumber}</TableCell>
              <TableCell>{entry.accountName}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell className="text-right">{entry.debit.toFixed(2)}</TableCell>
              <TableCell className="text-right">{entry.credit.toFixed(2)}</TableCell>
              <TableCell className="text-right">{(entry.debit - entry.credit).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LedgerTable;