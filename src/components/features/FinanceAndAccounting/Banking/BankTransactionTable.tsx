import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { BankTransaction } from './types';

interface BankTransactionTableProps {
  transactions: BankTransaction[];
  onUpdateTransaction: (id: string, updates: Partial<BankTransaction>) => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (id: string) => void;
}

const BankTransactionTable: React.FC<BankTransactionTableProps> = ({
  transactions,
  onUpdateTransaction,
  onDeleteTransaction,
  onEditTransaction,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-center">Reconciled</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
            <TableCell>{transaction.type}</TableCell>
            <TableCell className="text-center">
              <input
                type="checkbox"
                checked={transaction.reconciled}
                onChange={(e) => onUpdateTransaction(transaction.id, { reconciled: e.target.checked })}
                className="h-4 w-4"
              />
            </TableCell>
            <TableCell className="text-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditTransaction(transaction.id)}
                className="mr-2"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteTransaction(transaction.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BankTransactionTable;