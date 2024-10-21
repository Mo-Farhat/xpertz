import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2, DollarSign, Percent } from 'lucide-react';

interface PricingRule {
  id: string;
  name: string;
  type: 'fixed' | 'percentage';
  value: number;
  startDate: Date;
  endDate: Date;
  productIds: string[];
  customerGroups: string[];
  active: boolean;
  createdAt: Date;
}

const PricingManagement: React.FC = () => {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [newPricingRule, setNewPricingRule] = useState<Omit<PricingRule, 'id' | 'createdAt'>>({
    name: '',
    type: 'fixed',
    value: 0,
    startDate: new Date(),
    endDate: new Date(),
    productIds: [],
    customerGroups: [],
    active: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'pricingRules'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pricingRulesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      } as PricingRule));
      setPricingRules(pricingRulesData);
    });
    return unsubscribe;
  }, []);

  const handleAddPricingRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'pricingRules'), {
        ...newPricingRule,
        createdAt: new Date(),
      });
      setNewPricingRule({
        name: '',
        type: 'fixed',
        value: 0,
        startDate: new Date(),
        endDate: new Date(),
        productIds: [],
        customerGroups: [],
        active: true,
      });
    } catch (error) {
      console.error("Error adding pricing rule: ", error);
    }
  };

  const handleUpdatePricingRule = async (id: string, updatedPricingRule: Partial<PricingRule>) => {
    try {
      await updateDoc(doc(db, 'pricingRules', id), updatedPricingRule);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating pricing rule: ", error);
    }
  };

  const handleDeletePricingRule = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'pricingRules', id));
    } catch (error) {
      console.error("Error deleting pricing rule: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = pricingRules.map(rule => 
      `${rule.name},${rule.type},${rule.value},${rule.startDate.toISOString()},${rule.endDate.toISOString()},${rule.productIds.join(';')},${rule.customerGroups.join(';')},${rule.active},${rule.createdAt.toISOString()}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'pricing_rules.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Pricing Management</h3>
      <form onSubmit={handleAddPricingRule} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Rule Name"
            value={newPricingRule.name}
            onChange={(e) => setNewPricingRule({ ...newPricingRule, name: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={newPricingRule.type}
            onChange={(e) => setNewPricingRule({ ...newPricingRule, type: e.target.value as 'fixed' | 'percentage' })}
            className="p-2 border rounded"
          >
            <option value="fixed">Fixed Amount</option>
            <option value="percentage">Percentage</option>
          </select>
          <input
            type="number"
            placeholder="Value"
            value={newPricingRule.value}
            onChange={(e) => setNewPricingRule({ ...newPricingRule, value: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={newPricingRule.startDate.toISOString().split('T')[0]}
            onChange={(e) => setNewPricingRule({ ...newPricingRule, startDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            placeholder="End Date"
            value={newPricingRule.endDate.toISOString().split('T')[0]}
            onChange={(e) => setNewPricingRule({ ...newPricingRule, endDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Product IDs (comma-separated)"
            value={newPricingRule.productIds.join(',')}
            onChange={(e) => setNewPricingRule({ ...newPricingRule, productIds: e.target.value.split(',') })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Customer Groups (comma-separated)"
            value={newPricingRule.customerGroups.join(',')}
            onChange={(e) => setNewPricingRule({ ...newPricingRule, customerGroups: e.target.value.split(',') })}
            className="p-2 border rounded"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={newPricingRule.active}
              onChange={(e) => setNewPricingRule({ ...newPricingRule, active: e.target.checked })}
              className="mr-2"
            />
            <label>Active</label>
          </div>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Pricing Rule
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
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-right">Value</th>
            <th className="py-3 px-6 text-left">Start Date</th>
            <th className="py-3 px-6 text-left">End Date</th>
            <th className="py-3 px-6 text-center">Active</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {pricingRules.map((rule) => (
            <tr key={rule.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{rule.name}</td>
              <td className="py-3 px-6 text-left">
                {rule.type === 'fixed' ? <DollarSign size={18} className="inline mr-1" /> : <Percent size={18} className="inline mr-1" />}
                {rule.type}
              </td>
              <td className="py-3 px-6 text-right">{rule.value}{rule.type === 'percentage' && '%'}</td>
              <td className="py-3 px-6 text-left">{rule.startDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">{rule.endDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-center">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  rule.active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                  {rule.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(rule.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeletePricingRule(rule.id)}
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

export default PricingManagement;