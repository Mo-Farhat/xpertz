import React, { useRef } from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Printer } from 'lucide-react';
import { Cheque } from './types';
import { printReceipt } from '../../PointOfSale/printUtils';
import ChequeReceipt from './ChequeReceipt';

interface ChequeTableProps {
  cheques: Cheque[];
  isLoading: boolean;
}

const ChequeTable: React.FC<ChequeTableProps> = ({ cheques, isLoading }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [selectedCheque, setSelectedCheque] = React.useState<Cheque | null>(null);

  const getStatusColor = (status: Cheque['status']) => {
    switch (status) {
      case 'cleared':
        return 'bg-green-100 text-green-800';
      case 'bounced':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handlePrint = (cheque: Cheque) => {
    setSelectedCheque(cheque);
    setTimeout(() => {
      if (receiptRef.current) {
        printReceipt(receiptRef.current);
      }
    }, 100);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Cheque #</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Payee</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead>Issued By</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Memo</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cheques.map((cheque) => (
            <TableRow key={cheque.id}>
              <TableCell>{format(cheque.date, 'dd/MM/yyyy')}</TableCell>
              <TableCell>{cheque.chequeNumber}</TableCell>
              <TableCell>
                <Badge variant={cheque.type === 'incoming' ? 'default' : 'secondary'}>
                  {cheque.type}
                </Badge>
              </TableCell>
              <TableCell>{cheque.payeeName}</TableCell>
              <TableCell>{cheque.bankName}</TableCell>
              <TableCell>{cheque.issuedBy}</TableCell>
              <TableCell className="text-right">${cheque.amount.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(cheque.status)}`}>
                  {cheque.status}
                </span>
              </TableCell>
              <TableCell>{cheque.memo}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handlePrint(cheque)}
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="hidden">
        {selectedCheque && (
          <ChequeReceipt ref={receiptRef} cheque={selectedCheque} />
        )}
      </div>
    </>
  );
};

export default ChequeTable;