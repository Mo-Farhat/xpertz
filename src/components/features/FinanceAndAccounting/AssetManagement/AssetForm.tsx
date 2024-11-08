import React from 'react';
import { Plus } from 'lucide-react';
import { Asset } from './types';

interface AssetFormProps {
  newAsset: Omit<Asset, 'id'>;
  setNewAsset: React.Dispatch<React.SetStateAction<Omit<Asset, 'id'>>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const AssetForm: React.FC<AssetFormProps> = ({ newAsset, setNewAsset, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="mb-4">
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
  );
};

export default AssetForm;