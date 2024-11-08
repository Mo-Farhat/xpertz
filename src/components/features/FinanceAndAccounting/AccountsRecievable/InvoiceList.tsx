import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Edit, Save } from 'lucide-react';
import { Invoice } from './types';

interface InvoiceListProps {
  invoices: Invoice[];
  editingId: string | null;
  onEdit: (id: string | null) => void;
  onUpdate: (id: string, updatedInvoice: Partial<Invoice>) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, editingId, onEdit, onUpdate }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer Name</TableHead>
          <TableHead>Invoice Number</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.customerName}</TableCell>
            <TableCell>{invoice.invoiceNumber}</TableCell>
            <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
            <TableCell>{invoice.dueDate.toLocaleDateString()}</TableCell>
            <TableCell>
              {editingId === invoice.id ? (
                <select
                  value={invoice.status}
                  onChange={(e) => onUpdate(invoice.id, { status: e.target.value as 'pending' | 'paid' | 'overdue' })}
                  className="p-1 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              ) : (
                <span className={`py-1 px-3 rounded-full text-xs ${
                  invoice.status === 'paid' ? 'bg-green-200 text-green-800' :
                  invoice.status === 'overdue' ? 'bg-red-200 text-red-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {invoice.status}
                </span>
              )}
            </TableCell>
            <TableCell className="text-center">
              {editingId === invoice.id ? (
                <button
                  onClick={() => onEdit(null)}
                  className="text-green-500 hover:text-green-700"
                >
                  <Save size={18} />
                </button>
              ) : (
                <button
                  onClick={() => onEdit(invoice.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={18} />
                </button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoiceList;