import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from "../../../../components/ui/card";
import { Cheque } from './types';

interface ChequeReceiptProps {
  cheque: Cheque;
}

const ChequeReceipt = React.forwardRef<HTMLDivElement, ChequeReceiptProps>(({ cheque }, ref) => {
  return (
    <div ref={ref} className="p-6 max-w-[300px] mx-auto text-sm">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-1">Cheque Receipt</h2>
        <p className="text-gray-600">{format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">Cheque No:</span>
          <span>{cheque.chequeNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Amount:</span>
          <span>${cheque.amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Date:</span>
          <span>{format(cheque.date, 'dd/MM/yyyy')}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Payee:</span>
          <span>{cheque.payeeName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Bank:</span>
          <span>{cheque.bankName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Status:</span>
          <span className="capitalize">{cheque.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Type:</span>
          <span className="capitalize">{cheque.type}</span>
        </div>
        {cheque.memo && (
          <div className="border-t pt-2 mt-2">
            <span className="font-semibold">Memo:</span>
            <p className="text-gray-600 mt-1">{cheque.memo}</p>
          </div>
        )}
      </div>
    </div>
  );
});

ChequeReceipt.displayName = 'ChequeReceipt';

export default ChequeReceipt;