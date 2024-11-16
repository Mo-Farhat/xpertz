import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { format } from 'date-fns';
import { DayBookEntry } from './types';

interface DayBookTableProps {
  entries: DayBookEntry[];
}

const DayBookTable: React.FC<DayBookTableProps> = ({ entries }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Transaction Type</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Debit</TableHead>
            <TableHead className="text-right">Credit</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{format(entry.timestamp, 'yyyy-MM-dd HH:mm:ss')}</TableCell>
              <TableCell>{entry.transactionType}</TableCell>
              <TableCell>{entry.reference}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell className="text-right">{entry.debit.toFixed(2)}</TableCell>
              <TableCell className="text-right">{entry.credit.toFixed(2)}</TableCell>
              <TableCell>{entry.account}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  entry.status === 'posted' ? 'bg-green-100 text-green-800' :
                  entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
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

export default DayBookTable;