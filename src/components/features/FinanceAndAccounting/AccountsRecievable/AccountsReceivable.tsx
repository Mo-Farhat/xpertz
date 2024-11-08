import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Plus, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import InvoiceList from './InvoiceList';
import ARReport from './ARReport';
import { Invoice } from './types';
import { useToast } from "../../../hooks/use-toast";

const AccountsReceivable: React.FC = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, 'id'>>({
    customerName: '',
    invoiceNumber: '',
    amount: 0,
    dueDate: new Date(),
    status: 'pending',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'accountsReceivable'), orderBy('dueDate'), limit(50));
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
      await addDoc(collection(db, 'accountsReceivable'), {
        ...newInvoice,
        dueDate: new Date(newInvoice.dueDate),
      });
      setNewInvoice({
        customerName: '',
        invoiceNumber: '',
        amount: 0,
        dueDate: new Date(),
        status: 'pending',
      });
      toast({
        title: "Success",
        description: "Invoice added successfully",
      });
    } catch (error) {
      console.error("Error adding invoice: ", error);
      toast({
        title: "Error",
        description: "Failed to add invoice",
        variant: "destructive",
      });
    }
  };

  const handleUpdateInvoice = async (id: string, updatedInvoice: Partial<Invoice>) => {
    try {
      await updateDoc(doc(db, 'accountsReceivable', id), updatedInvoice);
      setEditingId(null);
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
    } catch (error) {
      console.error("Error updating invoice: ", error);
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csvContent = invoices.map(invoice => 
      `${invoice.customerName},${invoice.invoiceNumber},${invoice.amount},${invoice.dueDate.toISOString()},${invoice.status}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'accounts_receivable.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices">
          <div className="p-4">
            <form onSubmit={handleAddInvoice} className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newInvoice.customerName}
                  onChange={(e) => setNewInvoice({ ...newInvoice, customerName: e.target.value })}
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
            <InvoiceList
              invoices={invoices}
              editingId={editingId}
              onEdit={setEditingId}
              onUpdate={handleUpdateInvoice}
            />
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <ARReport invoices={invoices} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountsReceivable;