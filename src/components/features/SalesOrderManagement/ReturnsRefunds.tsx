import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2, RefreshCcw } from 'lucide-react';

interface ReturnRefund {
  id: string;
  orderId: string;
  customerName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  amount: number;
  requestDate: Date;
  processedDate?: Date;
  createdAt: Date;
}

const ReturnsRefunds: React.FC = () => {
  const [returnsRefunds, setReturnsRefunds] = useState<ReturnRefund[]>([]);
  const [newReturnRefund, setNewReturnRefund] = useState<Omit<ReturnRefund, 'id' | 'createdAt'>>({
    orderId: '',
    customerName: '',
    reason: '',
    status: 'pending',
    amount: 0,
    requestDate: new Date(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'returnsRefunds'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const returnsRefundsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        requestDate: doc.data().requestDate.toDate(),
        processedDate: doc.data().processedDate?.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      } as ReturnRefund));
      setReturnsRefunds(returnsRefundsData);
    });
    return unsubscribe;
  }, []);

  const handleAddReturnRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'returnsRefunds'), {
        ...newReturnRefund,
        createdAt: new Date(),
      });
      setNewReturnRefund({
        orderId: '',
        customerName: '',
        reason: '',
        status: 'pending',
        amount: 0,
        requestDate: new Date(),
      });
    } catch (error) {
      console.error("Error adding return/refund: ", error);
    }
  };

  const handleUpdateReturnRefund = async (id: string, updatedReturnRefund: Partial<ReturnRefund>) => {
    try {
      await updateDoc(doc(db, 'returnsRefunds', id), updatedReturnRefund);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating return/refund: ", error);
    }
  };

  const handleDeleteReturnRefund = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'returnsRefunds', id));
    } catch (error) {
      console.error("Error deleting return/refund: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = returnsRefunds.map(returnRefund => 
      `${returnRefund.orderId},${returnRefund.customerName},${returnRefund.reason},${returnRefund.status},${returnRefund.amount},${returnRefund.requestDate.toISOString()},${returnRefund.processedDate?.toISOString() || ''},${returnRefund.createdAt.toISOString()}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'returns_refunds.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Returns and Refunds</h3>
      <form onSubmit={handleAddReturnRefund} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Order ID"
            value={newReturnRefund.orderId}
            onChange={(e) => setNewReturnRefund({ ...newReturnRefund, orderId: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Customer Name"
            value={newReturnRefund.customerName}
            onChange={(e) => setNewReturnRefund({ ...newReturnRefund, customerName: e.target.value })}
            className="p-2 border rounded"
          />
          <textarea
            placeholder="Reason"
            value={newReturnRefund.reason}
            onChange={(e) => setNewReturnRefund({ ...newReturnRefund, reason: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={newReturnRefund.status}
            onChange={(e) => setNewReturnRefund({ ...newReturnRefund, status: e.target.value as ReturnRefund['status'] })}
            className="p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="processed">Processed</option>
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={newReturnRefund.amount}
            onChange={(e) => setNewReturnRefund({ ...newReturnRefund, amount: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newReturnRefund.requestDate.toISOString().split('T')[0]}
            onChange={(e) => setNewReturnRefund({ ...newReturnRefund, requestDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Return/Refund
        </button>
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
            <th className="py-3 px-6 text-left">Order ID</th>
            <th className="py-3 px-6 text-left">Customer</th>
            <th className="py-3 px-6 text-left">Reason</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-right">Amount</th>
            <th className="py-3 px-6 text-left">Request Date</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {returnsRefunds.map((returnRefund) => (
            <tr key={returnRefund.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{returnRefund.orderId}</td>
              <td className="py-3 px-6 text-left">{returnRefund.customerName}</td>
              <td className="py-3 px-6 text-left">{returnRefund.reason}</td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  returnRefund.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                  returnRefund.status === 'approved' ? 'bg-green-200 text-green-800' :
                  returnRefund.status === 'rejected' ? 'bg-red-200 text-red-800' :
                  'bg-blue-200 text-blue-800'
                }`}>
                  {returnRefund.status}
                </span>
              </td>
              <td className="py-3 px-6 text-right">${returnRefund.amount.toFixed(2)}</td>
              <td className="py-3 px-6 text-left">{returnRefund.requestDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(returnRefund.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteReturnRefund(returnRefund.id)}
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

export default ReturnsRefunds;