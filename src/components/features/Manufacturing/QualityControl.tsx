import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2 } from 'lucide-react';

interface QualityCheck {
  id: string;
  workOrderId: string;
  productName: string;
  checkDate: Date;
  inspector: string;
  result: 'pass' | 'fail';
  notes: string;
}

const QualityControl: React.FC = () => {
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([]);
  const [newCheck, setNewCheck] = useState<Omit<QualityCheck, 'id'>>({
    workOrderId: '',
    productName: '',
    checkDate: new Date(),
    inspector: '',
    result: 'pass',
    notes: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'qualityChecks'), orderBy('checkDate', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const checkData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        checkDate: doc.data().checkDate.toDate(),
      } as QualityCheck));
      setQualityChecks(checkData);
    });
    return unsubscribe;
  }, []);

  const handleAddCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'qualityChecks'), {
        ...newCheck,
        checkDate: new Date(newCheck.checkDate),
      });
      setNewCheck({
        workOrderId: '',
        productName: '',
        checkDate: new Date(),
        inspector: '',
        result: 'pass',
        notes: '',
      });
    } catch (error) {
      console.error("Error adding quality check: ", error);
    }
  };

  const handleUpdateCheck = async (id: string, updatedCheck: Partial<QualityCheck>) => {
    try {
      await updateDoc(doc(db, 'qualityChecks', id), updatedCheck);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating quality check: ", error);
    }
  };

  const handleDeleteCheck = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'qualityChecks', id));
    } catch (error) {
      console.error("Error deleting quality check: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = qualityChecks.map(check => 
      `${check.workOrderId},${check.productName},${check.checkDate.toISOString()},${check.inspector},${check.result},${check.notes}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'quality_checks.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Quality Control</h3>
      <form onSubmit={handleAddCheck} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Work Order ID"
            value={newCheck.workOrderId}
            onChange={(e) => setNewCheck({ ...newCheck, workOrderId: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Product Name"
            value={newCheck.productName}
            onChange={(e) => setNewCheck({ ...newCheck, productName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="datetime-local"
            value={newCheck.checkDate.toISOString().slice(0, 16)}
            onChange={(e) => setNewCheck({ ...newCheck, checkDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Inspector"
            value={newCheck.inspector}
            onChange={(e) => setNewCheck({ ...newCheck, inspector: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={newCheck.result}
            onChange={(e) => setNewCheck({ ...newCheck, result: e.target.value as 'pass' | 'fail' })}
            className="p-2 border rounded"
          >
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
          </select>
          <input
            type="text"
            placeholder="Notes"
            value={newCheck.notes}
            onChange={(e) => setNewCheck({ ...newCheck, notes: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Quality Check
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
            <th className="py-3 px-6 text-left">Work Order ID</th>
            <th className="py-3 px-6 text-left">Product Name</th>
            <th className="py-3 px-6 text-left">Check Date</th>
            <th className="py-3 px-6 text-left">Inspector</th>
            <th className="py-3 px-6 text-left">Result</th>
            <th className="py-3 px-6 text-left">Notes</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {qualityChecks.map((check) => (
            <tr key={check.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{check.workOrderId}</td>
              <td className="py-3 px-6 text-left">{check.productName}</td>
              <td className="py-3 px-6 text-left">{check.checkDate.toLocaleString()}</td>
              <td className="py-3 px-6 text-left">{check.inspector}</td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  check.result === 'pass' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                  {check.result}
                </span>
              </td>
              <td className="py-3 px-6 text-left">{check.notes}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(check.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteCheck(check.id)}
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

export default QualityControl;