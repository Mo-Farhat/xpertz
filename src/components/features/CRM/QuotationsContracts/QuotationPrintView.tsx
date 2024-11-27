import React from 'react';
import { format } from 'date-fns';
import { QuotationContract } from './types';

interface QuotationPrintViewProps {
  document: QuotationContract;
}

const QuotationPrintView = React.forwardRef<HTMLDivElement, QuotationPrintViewProps>(
  ({ document }, ref) => {
    return (
      <div ref={ref} className="p-8 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {document.type === 'quotation' ? 'Quotation' : 'Contract'}
          </h1>
          <p className="text-gray-600">#{document.id}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <h3 className="font-semibold mb-2">Customer Details:</h3>
            <p>{document.customerName}</p>
            <p>{document.customerEmail}</p>
            <p>{document.customerPhone}</p>
          </div>
          <div className="text-right">
            <p><span className="font-semibold">Date: </span>{format(document.createdAt, 'PP')}</p>
            <p><span className="font-semibold">Valid Until: </span>{format(document.validUntil, 'PP')}</p>
            <p><span className="font-semibold">Status: </span>{document.status}</p>
          </div>
        </div>

        {document.items && document.items.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Items:</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {document.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">${item.price.toFixed(2)}</td>
                    <td className="text-right py-2">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan={3} className="text-right py-2">Total:</td>
                  <td className="text-right py-2">${document.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="space-y-4">
          {document.content && (
            <div>
              <h3 className="font-semibold mb-2">Description:</h3>
              <p className="whitespace-pre-wrap">{document.content}</p>
            </div>
          )}
          
          {document.terms && (
            <div>
              <h3 className="font-semibold mb-2">Terms & Conditions:</h3>
              <p className="whitespace-pre-wrap">{document.terms}</p>
            </div>
          )}

          {document.paymentTerms && (
            <div>
              <h3 className="font-semibold mb-2">Payment Terms:</h3>
              <p className="whitespace-pre-wrap">{document.paymentTerms}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

QuotationPrintView.displayName = 'QuotationPrintView';

export default QuotationPrintView;