import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2 } from 'lucide-react';

interface ProductionPlan {
  id: string;
  productName: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
}

const ProductionPlanning: React.FC = () => {
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [newPlan, setNewPlan] = useState<Omit<ProductionPlan, 'id'>>({
    productName: '',
    quantity: 0,
    startDate: new Date(),
    endDate: new Date(),
    status: 'planned',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'productionPlans'), orderBy('startDate'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const planData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
      } as ProductionPlan));
      setPlans(planData);
    });
    return unsubscribe;
  }, []);

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'productionPlans'), {
        ...newPlan,
        startDate: new Date(newPlan.startDate),
        endDate: new Date(newPlan.endDate),
      });
      setNewPlan({
        productName: '',
        quantity: 0,
        startDate: new Date(),
        endDate: new Date(),
        status: 'planned',
      });
    } catch (error) {
      console.error("Error adding production plan: ", error);
    }
  };

  const handleUpdatePlan = async (id: string, updatedPlan: Partial<ProductionPlan>) => {
    try {
      await updateDoc(doc(db, 'productionPlans', id), updatedPlan);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating production plan: ", error);
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'productionPlans', id));
    } catch (error) {
      console.error("Error deleting production plan: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = plans.map(plan => 
      `${plan.productName},${plan.quantity},${plan.startDate.toISOString()},${plan.endDate.toISOString()},${plan.status}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'production_plans.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Production Planning</h3>
      <form onSubmit={handleAddPlan} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newPlan.productName}
            onChange={(e) => setNewPlan({ ...newPlan, productName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newPlan.quantity}
            onChange={(e) => setNewPlan({ ...newPlan, quantity: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newPlan.startDate.toISOString().split('T')[0]}
            onChange={(e) => setNewPlan({ ...newPlan, startDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newPlan.endDate.toISOString().split('T')[0]}
            onChange={(e) => setNewPlan({ ...newPlan, endDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <select
            value={newPlan.status}
            onChange={(e) => setNewPlan({ ...newPlan, status: e.target.value as ProductionPlan['status'] })}
            className="p-2 border rounded"
          >
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Production Plan
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
            <th className="py-3 px-6 text-left">Product Name</th>
            <th className="py-3 px-6 text-right">Quantity</th>
            <th className="py-3 px-6 text-left">Start Date</th>
            <th className="py-3 px-6 text-left">End Date</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {plans.map((plan) => (
            <tr key={plan.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{plan.productName}</td>
              <td className="py-3 px-6 text-right">{plan.quantity}</td>
              <td className="py-3 px-6 text-left">{plan.startDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">{plan.endDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  plan.status === 'planned' ? 'bg-yellow-200 text-yellow-800' :
                  plan.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
                  plan.status === 'completed' ? 'bg-green-200 text-green-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {plan.status}
                </span>
              </td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(plan.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
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

export default ProductionPlanning;