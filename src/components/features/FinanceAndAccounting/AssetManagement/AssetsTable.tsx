import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Asset } from './types';

interface AssetsTableProps {
  assets: Asset[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const AssetsTable: React.FC<AssetsTableProps> = ({ assets, onEdit, onDelete }) => {
  return (
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
                onClick={() => onEdit(asset.id)}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(asset.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AssetsTable;