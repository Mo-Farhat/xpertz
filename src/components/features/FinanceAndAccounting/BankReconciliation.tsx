import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Save, Trash2 } from 'lucide-react';

interface BankTransaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  reconciled: boolean;
}

const BankReconciliation: React.FC = () => {
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Omit<BankTransaction, 'id'>>({
    date: new Date(),
    description: '',
    amount: 0,
    type: 'credit',
    reconciled: false,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

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
    return unsubscribe;
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
      });
    } catch (error) {
      console.error("Error adding transaction: ", error);
    }
  };

  const handleUpdateTransaction = async (id: string, updatedTransaction: Partial<BankTransaction>) => {
    try {
      await updateDoc(doc(db, 'bankTransactions', id), updatedTransaction);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating transaction: ", error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bankTransactions', id));
    } catch (error) {
      console.error("Error deleting transaction: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = transactions.map(transaction => 
      `${transaction.date.toISOString()},${transaction.description},${transaction.amount},${transaction.type},${transaction.reconciled}`
    ).join('\n');

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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Bank Reconciliation</h2>
      <form onSubmit={handleAddTransaction} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={newTransaction.date.toISOString().split('T')[0]}
            onChange={(e) => setNewTransaction({ ...newTransaction, date: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <select
            value={newTransaction.type}
            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'credit' | 'debit' })}
            className="p-2 border rounded"
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newTransaction.reconciled}
              onChange={(e) => setNewTransaction({ ...newTransaction, reconciled: e.target.checked })}
              className="mr-2"
            />
            <label>Reconciled</label>
          </div>
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
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-right">Amount</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-center">Reconciled</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{transaction.date.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">{transaction.description}</td>
              <td className="py-3 px-6 text-right">${transaction.amount.toFixed(2)}</td>
              <td className="py-3 px-6 text-left">{transaction.type}</td>
              <td className="py-3 px-6 text-center">
                <input
                  type="checkbox"
                  checked={transaction.reconciled}
                  onChange={(e) => handleUpdateTransaction(transaction.id, { reconciled: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(transaction.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteTransaction(transaction.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BankReconciliation;