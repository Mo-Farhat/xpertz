import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Save, Trash2 } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  category: string;
  depreciationMethod: 'straight-line' | 'declining-balance' | 'units-of-production';
  usefulLife: number;
}

const AssetManagement: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newAsset, setNewAsset] = useState<Omit<Asset, 'id'>>({
    name: '',
    purchaseDate: new Date(),
    purchasePrice: 0,
    currentValue: 0,
    category: '',
    depreciationMethod: 'straight-line',
    usefulLife: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'assets'), orderBy('purchaseDate', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const assetData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        purchaseDate: doc.data().purchaseDate.toDate(),
      } as Asset));
      setAssets(assetData);
    });
    return unsubscribe;
  }, []);

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'assets'), {
        ...newAsset,
        purchaseDate: new Date(newAsset.purchaseDate),
      });
      setNewAsset({
        name: '',
        purchaseDate: new Date(),
        purchasePrice: 0,
        currentValue: 0,
        category: '',
        depreciationMethod: 'straight-line',
        usefulLife: 0,
      });
    } catch (error) {
      console.error("Error adding asset: ", error);
    }
  };

  const handleUpdateAsset = async (id: string, updatedAsset: Partial<Asset>) => {
    try {
      await updateDoc(doc(db, 'assets', id), updatedAsset);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating asset: ", error);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'assets', id));
    } catch (error) {
      console.error("Error deleting asset: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = assets.map(asset => 
      `${asset.name},${asset.purchaseDate.toISOString()},${asset.purchasePrice},${asset.currentValue},${asset.category},${asset.depreciationMethod},${asset.usefulLife}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'assets.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Asset Management</h2>
      <form onSubmit={handleAddAsset} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Asset Name"
            value={newAsset.name}
            onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newAsset.purchaseDate.toISOString().split('T')[0]}
            onChange={(e) => setNewAsset({ ...newAsset, purchaseDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Purchase Price"
            value={newAsset.purchasePrice}
            onChange={(e) => setNewAsset({ ...newAsset, purchasePrice: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Current Value"
            value={newAsset.currentValue}
            onChange={(e) => setNewAsset({ ...newAsset, currentValue: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={newAsset.category}
            onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={newAsset.depreciationMethod}
            onChange={(e) => setNewAsset({ ...newAsset, depreciationMethod: e.target.value as 'straight-line' | 'declining-balance' | 'units-of-production' })}
            className="p-2 border rounded"
          >
            <option value="straight-line">Straight Line</option>
            <option value="declining-balance">Declining Balance</option>
            <option value="units-of-production">Units of Production</option>
          </select>
          <input
            type="number"
            placeholder="Useful Life (years)"
            value={newAsset.usefulLife}
            onChange={(e) => setNewAsset({ ...newAsset, usefulLife: parseInt(e.target.value) })}
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
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Purchase Date</th>
            <th className="py-3 px-6 text-right">Purchase Price</th>
            <th className="py-3 px-6 text-right">Current Value</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Depreciation Method</th>
            <th className="py-3 px-6 text-right">Useful Life</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{asset.name}</td>
              <td className="py-3 px-6 text-left">{asset.purchaseDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-right">${asset.purchasePrice.toFixed(2)}</td>
              <td className="py-3 px-6 text-right">${asset.currentValue.toFixed(2)}</td>
              <td className="py-3 px-6 text-left">{asset.category}</td>
              <td className="py-3 px-6 text-left">{asset.depreciationMethod}</td>
              <td className="py-3 px-6 text-right">{asset.usefulLife} years</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(asset.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteAsset(asset.id)}
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

export default AssetManagement;