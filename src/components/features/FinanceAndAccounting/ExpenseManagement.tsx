import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Save, Trash2 } from 'lucide-react';

interface Expense {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ExpenseManagement: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    date: new Date(),
    description: '',
    amount: 0,
    category: '',
    status: 'pending',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('date', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expenseData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      } as Expense));
      setExpenses(expenseData);
    });
    return unsubscribe;
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'expenses'), {
        ...newExpense,
        date: new Date(newExpense.date),
      });
      setNewExpense({
        date: new Date(),
        description: '',
        amount: 0,
        category: '',
        status: 'pending',
      });
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  const handleUpdateExpense = async (id: string, updatedExpense: Partial<Expense>) => {
    try {
      await updateDoc(doc(db, 'expenses', id), updatedExpense);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating expense: ", error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = expenses.map(expense => 
      `${expense.date.toISOString()},${expense.description},${expense.amount},${expense.category},${expense.status}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'expenses.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Expense Management</h2>
      <form onSubmit={handleAddExpense} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={newExpense.date.toISOString().split('T')[0]}
            onChange={(e) => setNewExpense({ ...newExpense, date: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={newExpense.status}
            onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value as 'pending' | 'approved' | 'rejected' })}
            className="p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-right">Amount</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{expense.date.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">{expense.description}</td>
              <td className="py-3 px-6 text-right">${expense.amount.toFixed(2)}</td>
              <td className="py-3 px-6 text-left">{expense.category}</td>
              <td className="py-3 px-6 text-left">
                {editingId === expense.id ? (
                  <select
                    value={expense.status}
                    onChange={(e) => handleUpdateExpense(expense.id, { status: e.target.value as 'pending' | 'approved' | 'rejected' })}
                    className="p-1 border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                ) : (
                  <span className={`py-1 px-3 rounded-full text-xs ${
                    expense.status === 'approved' ? 'bg-green-200 text-green-800' :
                    expense.status === 'rejected' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {expense.status}
                  </span>
                )}
              </td>
              <td className="py-3 px-6 text-center">
                {editingId === expense.id ? (
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-green-500 hover:text-green-700 mr-2"
                  >
                    <Save size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingId(expense.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteExpense(expense.id)}
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

export default ExpenseManagement;