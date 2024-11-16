import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { useToast } from "../../../hooks/use-toast";
import InvoiceForm from './InvoiceForm';
import InvoiceTable from './InvoiceTable';
import { InvoiceFormData } from './types';

const InvoicePayment = () => {
  const [invoices, setInvoices] = useState<InvoiceFormData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'purchaseInvoices'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invoicesData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        invoiceDate: doc.data().invoiceDate?.toDate() || new Date(),
        dueDate: doc.data().dueDate || new Date().toISOString()
      })) as InvoiceFormData[];
      setInvoices(invoicesData);
    }, (error) => {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error",
        description: "Failed to fetch invoices",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [toast]);

  const handleSubmit = async (formData: InvoiceFormData) => {
    try {
      await addDoc(collection(db, 'purchaseInvoices'), formData);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoice & Payment Processing</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Invoice</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <InvoiceForm onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <InvoiceTable invoices={invoices} />
    </div>
  );
};

export default InvoicePayment;