import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Download } from 'lucide-react';
import { BankTransaction } from './types';
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { useToast } from "../../../hooks/use-toast";
import BankTransactionForm from './BankTransactionForm';
import BankTransactionTable from './BankTransactionTable';

const BankTransactions: React.FC = () => {
    const [transactions, setTransactions] = useState<BankTransaction[]>([]);
    const [newTransaction, setNewTransaction] = useState<Omit<BankTransaction, 'id'>>({
      date: new Date(),
      description: '',
      amount: 0,
      type: 'credit',
      reconciled: false,
      category: '',
      referenceNumber: '',
      notes: '',
      paymentMethod: '',
      status: 'pending'
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const { toast } = useToast();
  
    useEffect(() => {
      const q = query(collection(db, 'bankTransactions'), orderBy('date', 'desc'), limit(50));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const transactionData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
        } as BankTransaction));
        setTransactions(transactionData);
      });
      return () => unsubscribe();
    }, []);
  
    const handleAddTransaction = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await addDoc(collection(db, 'bankTransactions'), {
          ...newTransaction,
          date: new Date(newTransaction.date),
        });
        setNewTransaction({
          date: new Date(),
          description: '',
          amount: 0,
          type: 'credit',
          reconciled: false,
          category: '',
          referenceNumber: '',
          notes: '',
          paymentMethod: '',
          status: 'pending'
        });
        toast({
          title: "Success",
          description: "Transaction added successfully",
        });
      } catch (error) {
        console.error("Error adding transaction: ", error);
        toast({
          title: "Error",
          description: "Failed to add transaction",
          variant: "destructive",
        });
      }
    };
  
    const handleUpdateTransaction = async (id: string, updates: Partial<BankTransaction>) => {
      try {
        await updateDoc(doc(db, 'bankTransactions', id), updates);
        setEditingId(null);
        toast({
          title: "Success",
          description: "Transaction updated successfully",
        });
      } catch (error) {
        console.error("Error updating transaction: ", error);
        toast({
          title: "Error",
          description: "Failed to update transaction",
          variant: "destructive",
        });
      }
    };
  
    const handleDeleteTransaction = async (id: string) => {
      try {
        await deleteDoc(doc(db, 'bankTransactions', id));
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting transaction: ", error);
        toast({
          title: "Error",
          description: "Failed to delete transaction",
          variant: "destructive",
        });
      }
    };
  
    const handleExport = () => {
      const csvContent = [
        ['Date', 'Description', 'Amount', 'Type', 'Reconciled', 'Category', 'Reference', 'Payment Method', 'Status', 'Notes'].join(','),
        ...transactions.map(transaction => 
          `${transaction.date.toISOString()},${transaction.description},${transaction.amount},${transaction.type},${transaction.reconciled},${transaction.category},${transaction.referenceNumber},${transaction.paymentMethod},${transaction.status},${transaction.notes}`
        )
      ].join('\n');
  
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'bank_transactions.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
  
    return (
      <Card>
        <CardContent className="p-6 space-y-6">
          <BankTransactionForm
            newTransaction={newTransaction}
            setNewTransaction={setNewTransaction}
            onSubmit={handleAddTransaction}
          />
  
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
  
          <BankTransactionTable
            transactions={transactions}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={setEditingId}
          />
        </CardContent>
      </Card>
    );
  };
  
  export default BankTransactions;