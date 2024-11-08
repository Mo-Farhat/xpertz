import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { TaxRecord } from './types';

interface TaxTableProps {
  taxRecords: TaxRecord[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaxTable: React.FC<TaxTableProps> = ({ taxRecords, onEdit, onDelete }) => {
  return (
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
                onClick={() => onEdit(record.id)}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(record.id)}
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

export default TaxTable;