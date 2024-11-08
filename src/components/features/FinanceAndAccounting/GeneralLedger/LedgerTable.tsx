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
            <TableHead>Account</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Debit</TableHead>
            <TableHead className="text-right">Credit</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{format(entry.date, 'yyyy-MM-dd')}</TableCell>
              <TableCell>{entry.accountNumber} - {entry.accountName}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell>{entry.reference}</TableCell>
              <TableCell>{entry.category}</TableCell>
              <TableCell className="text-right">{entry.debit.toFixed(2)}</TableCell>
              <TableCell className="text-right">{entry.credit.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  entry.status === 'completed' ? 'bg-green-100 text-green-800' :
                  entry.status === 'reconciled' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {entry.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LedgerTable;