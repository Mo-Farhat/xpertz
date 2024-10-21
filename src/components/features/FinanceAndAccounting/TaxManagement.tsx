import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Save, Trash2 } from 'lucide-react';

interface TaxRecord {
  id: string;
  taxYear: number;
  taxType: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  region: string;
}

const TaxManagement: React.FC = () => {
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([]);
  const [newTaxRecord, setNewTaxRecord] = useState<Omit<TaxRecord, 'id'>>({
    taxYear: new Date().getFullYear(),
    taxType: '',
    amount: 0,
    dueDate: new Date(),
    status: 'pending',
    region: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'taxRecords'), orderBy('dueDate'), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const records = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate.toDate(),
      } as TaxRecord));
      setTaxRecords(records);
    });
    return unsubscribe;
  }, []);

  const handleAddTaxRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'taxRecords'), {
        ...newTaxRecord,
        dueDate: new Date(newTaxRecord.dueDate),
      });
      setNewTaxRecord({
        taxYear: new Date().getFullYear(),
        taxType: '',
        amount: 0,
        dueDate: new Date(),
        status: 'pending',
        region: '',
      });
    } catch (error) {
      console.error("Error adding tax record: ", error);
    }
  };

  const handleUpdateTaxRecord = async (id: string, updatedRecord: Partial<TaxRecord>) => {
    try {
      await updateDoc(doc(db, 'taxRecords', id), updatedRecord);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating tax record: ", error);
    }
  };

  const handleDeleteTaxRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'taxRecords', id));
    } catch (error) {
      console.error("Error deleting tax record: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = taxRecords.map(record => 
      `${record.taxYear},${record.taxType},${record.amount},${record.dueDate.toISOString()},${record.status},${record.region}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'tax_records.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tax Management</h2>
      <form onSubmit={handleAddTaxRecord} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Tax Year"
            value={newTaxRecord.taxYear}
            onChange={(e) => setNewTaxRecord({ ...newTaxRecord, taxYear: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Tax Type"
            value={newTaxRecord.taxType}
            onChange={(e) => setNewTaxRecord({ ...newTaxRecord, taxType: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newTaxRecord.amount}
            onChange={(e) => setNewTaxRecord({ ...newTaxRecord, amount: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newTaxRecord.dueDate.toISOString().split('T')[0]}
            onChange={(e) => setNewTaxRecord({ ...newTaxRecord, dueDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <select
            value={newTaxRecord.status}
            onChange={(e) => setNewTaxRecord({ ...newTaxRecord, status: e.target.value as 'pending' | 'paid' | 'overdue' })}
            className="p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <input
            type="text"
            placeholder="Region"
            value={newTaxRecord.region}
            onChange={(e) => setNewTaxRecord({ ...newTaxRecord, region: e.target.value })}
            className="p-2 border rounded"
          />
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
            <th className="py-3 px-6 text-left">Tax Year</th>
            <th className="py-3 px-6 text-left">Tax Type</th>
            <th className="py-3 px-6 text-right">Amount</th>
            <th className="py-3 px-6 text-left">Due Date</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Region</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {taxRecords.map((record) => (
            <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{record.taxYear}</td>
              <td className="py-3 px-6 text-left">{record.taxType}</td>
              <td className="py-3 px-6 text-right">${record.amount.toFixed(2)}</td>
              <td className="py-3 px-6 text-left">{record.dueDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  record.status === 'paid' ? 'bg-green-200 text-green-800' :
                  record.status === 'overdue' ? 'bg-red-200 text-red-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {record.status}
                </span>
              </td>
              <td className="py-3 px-6 text-left">{record.region}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(record.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteTaxRecord(record.id)}
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

export default TaxManagement;