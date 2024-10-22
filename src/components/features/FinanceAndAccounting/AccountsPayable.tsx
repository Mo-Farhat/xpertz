import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Save } from 'lucide-react';

interface Invoice {
  id: string;
  vendorName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
}

const AccountsPayable: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, 'id'>>({
    vendorName: '',
    invoiceNumber: '',
    amount: 0,
    dueDate: new Date(),
    status: 'pending',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'accountsPayable'), orderBy('dueDate'), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const invoiceData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate.toDate(),
      } as Invoice));
      setInvoices(invoiceData);
    });
    return unsubscribe;
  }, []);

  const handleAddInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'accountsPayable'), {
        ...newInvoice,
        dueDate: new Date(newInvoice.dueDate),
      });
      setNewInvoice({
        vendorName: '',
        invoiceNumber: '',
        amount: 0,
        dueDate: new Date(),
        status: 'pending',
      });
    } catch (error) {
      console.error("Error adding invoice: ", error);
    }
  };

  const handleUpdateInvoice = async (id: string, updatedInvoice: Partial<Invoice>) => {
    try {
      await updateDoc(doc(db, 'accountsPayable', id), updatedInvoice);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating invoice: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = invoices.map(invoice => 
      `${invoice.vendorName},${invoice.invoiceNumber},${invoice.amount},${invoice.dueDate.toISOString()},${invoice.status}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'accounts_payable.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Accounts Payable</h2>
      <form onSubmit={handleAddInvoice} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Vendor Name"
            value={newInvoice.vendorName}
            onChange={(e) => setNewInvoice({ ...newInvoice, vendorName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Invoice Number"
            value={newInvoice.invoiceNumber}
            onChange={(e) => setNewInvoice({ ...newInvoice, invoiceNumber: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newInvoice.amount}
            onChange={(e) => setNewInvoice({ ...newInvoice, amount: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newInvoice.dueDate.toISOString().split('T')[0]}
            onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <select
            value={newInvoice.status}
            onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value as 'pending' | 'paid' | 'overdue' })}
            className="p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <Plus size={24} />
          </button>
        </div>
      </form>
      <button
        onClick={handleExport}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
      >
        <Download size={18} className="mr-2" />
        Export CSV
      </button>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Vendor</th>
            <th className="py-3 px-6 text-left">Invoice #</th>
            <th className="py-3 px-6 text-right">Amount</th>
            <th className="py-3 px-6 text-left">Due Date</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{invoice.vendorName}</td>
              <td className="py-3 px-6 text-left">{invoice.invoiceNumber}</td>
              <td className="py-3 px-6 text-right">${invoice.amount.toFixed(2)}</td>
              <td className="py-3 px-6 text-left">{invoice.dueDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">
                {editingId === invoice.id ? (
                  <select
                    value={invoice.status}
                    onChange={(e) => handleUpdateInvoice(invoice.id, { status: e.target.value as 'pending' | 'paid' | 'overdue' })}
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
              </td>
              <td className="py-3 px-6 text-center">
                {editingId === invoice.id ? (
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <Save size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingId(invoice.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsPayable;