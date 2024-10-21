import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2, DollarSign } from 'lucide-react';

interface Deal {
  id: string;
  customerName: string;
  amount: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed won' | 'closed lost';
  probability: number;
  expectedCloseDate: Date;
  notes: string;
  createdAt: Date;
}

const SalesPipeline: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [newDeal, setNewDeal] = useState<Omit<Deal, 'id' | 'createdAt'>>({
    customerName: '',
    amount: 0,
    stage: 'prospecting',
    probability: 0,
    expectedCloseDate: new Date(),
    notes: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'deals'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dealsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        expectedCloseDate: doc.data().expectedCloseDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      } as Deal));
      setDeals(dealsData);
    });
    return unsubscribe;
  }, []);

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'deals'), {
        ...newDeal,
        createdAt: new Date(),
      });
      setNewDeal({
        customerName: '',
        amount: 0,
        stage: 'prospecting',
        probability: 0,
        expectedCloseDate: new Date(),
        notes: '',
      });
    } catch (error) {
      console.error("Error adding deal: ", error);
    }
  };

  const handleUpdateDeal = async (id: string, updatedDeal: Partial<Deal>) => {
    try {
      await updateDoc(doc(db, 'deals', id), updatedDeal);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating deal: ", error);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'deals', id));
    } catch (error) {
      console.error("Error deleting deal: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = deals.map(deal => 
      `${deal.customerName},${deal.amount},${deal.stage},${deal.probability},${deal.expectedCloseDate.toISOString()},${deal.notes},${deal.createdAt.toISOString()}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'sales_pipeline.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Sales Pipeline</h3>
      <form onSubmit={handleAddDeal} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={newDeal.customerName}
            onChange={(e) => setNewDeal({ ...newDeal, customerName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newDeal.amount}
            onChange={(e) => setNewDeal({ ...newDeal, amount: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <select
            value={newDeal.stage}
            onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value as Deal['stage'] })}
            className="p-2 border rounded"
          >
            <option value="prospecting">Prospecting</option>
            <option value="qualification">Qualification</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed won">Closed Won</option>
            <option value="closed lost">Closed Lost</option>
          </select>
          <input
            type="number"
            placeholder="Probability (%)"
            value={newDeal.probability}
            onChange={(e) => setNewDeal({ ...newDeal, probability: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newDeal.expectedCloseDate.toISOString().split('T')[0]}
            onChange={(e) => setNewDeal({ ...newDeal, expectedCloseDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <textarea
            placeholder="Notes"
            value={newDeal.notes}
            onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Deal
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
            <th className="py-3 px-6 text-left">Customer</th>
            <th className="py-3 px-6 text-right">Amount</th>
            <th className="py-3 px-6 text-left">Stage</th>
            <th className="py-3 px-6 text-right">Probability</th>
            <th className="py-3 px-6 text-left">Expected Close</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {deals.map((deal) => (
            <tr key={deal.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{deal.customerName}</td>
              <td className="py-3 px-6 text-right">
                <div className="flex items-center justify-end">
                  <DollarSign size={18} className="mr-2" />
                  {deal.amount.toFixed(2)}
                </div>
              </td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  deal.stage === 'closed won' ? 'bg-green-200 text-green-800' :
                  deal.stage === 'closed lost' ? 'bg-red-200 text-red-800' :
                  'bg-blue-200 text-blue-800'
                }`}>
                  {deal.stage}
                </span>
              </td>
              <td className="py-3 px-6 text-right">{deal.probability}%</td>
              <td className="py-3 px-6 text-left">{deal.expectedCloseDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(deal.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteDeal(deal.id)}
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

export default SalesPipeline;