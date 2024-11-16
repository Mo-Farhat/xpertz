import React from 'react';
import { PurchaseReturn } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

interface ReturnListProps {
  returns: PurchaseReturn[];
  onStatusUpdate: (returnId: string, newStatus: 'approved' | 'rejected') => Promise<void>;
}

const ReturnList: React.FC<ReturnListProps> = ({ returns, onStatusUpdate }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Return Number</TableHead>
          <TableHead>PO Reference</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Return Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {returns.map((returnItem) => (
          <TableRow key={returnItem.id}>
            <TableCell>{returnItem.returnNumber}</TableCell>
            <TableCell>{returnItem.poReference}</TableCell>
            <TableCell>{returnItem.supplierName}</TableCell>
            <TableCell>{returnItem.returnDate.toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={
                returnItem.status === 'approved' ? 'default' :
                returnItem.status === 'rejected' ? 'destructive' :
                'secondary'
              }>
                {returnItem.status}
              </Badge>
            </TableCell>
            <TableCell>${returnItem.amount.toFixed(2)}</TableCell>
            <TableCell className="space-x-2">
              {returnItem.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(returnItem.id, 'approved')}
                    variant="default"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(returnItem.id, 'rejected')}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReturnList;