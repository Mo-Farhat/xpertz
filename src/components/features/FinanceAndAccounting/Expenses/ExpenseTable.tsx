import React from 'react';
import { Edit, Save, Trash2 } from 'lucide-react';
import { Expense } from './types';

interface ExpenseTableProps {
  expenses: Expense[];
  editingId: string | null;
  onEdit: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Expense>) => void;
  onDelete: (id: string) => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  editingId,
  onEdit,
  onUpdate,
  onDelete,
}) => {
  return (
    <table className="w-full bg-white shadow-md rounded">
      <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-3 px-6 text-left">Date</th>
          <th className="py-3 px-6 text-left">Description</th>
          <th className="py-3 px-6 text-right">Amount</th>
          <th className="py-3 px-6 text-left">Category</th>
          <th className="py-3 px-6 text-left">Status</th>
          <th className="py-3 px-6 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {expenses.map((expense) => (
          <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left whitespace-nowrap">{expense.date.toLocaleDateString()}</td>
            <td className="py-3 px-6 text-left">{expense.description}</td>
            <td className="py-3 px-6 text-right">${expense.amount.toFixed(2)}</td>
            <td className="py-3 px-6 text-left">{expense.category}</td>
            <td className="py-3 px-6 text-left">
              {editingId === expense.id ? (
                <select
                  value={expense.status}
                  onChange={(e) => onUpdate(expense.id, { status: e.target.value as 'pending' | 'approved' | 'rejected' })}
                  className="p-1 border rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              ) : (
                <span className={`py-1 px-3 rounded-full text-xs ${
                  expense.status === 'approved' ? 'bg-green-200 text-green-800' :
                  expense.status === 'rejected' ? 'bg-red-200 text-red-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {expense.status}
                </span>
              )}
            </td>
            <td className="py-3 px-6 text-center">
              {editingId === expense.id ? (
                <button
                  onClick={() => onEdit(null)}
                  className="text-green-500 hover:text-green-700 mr-2"
                >
                  <Save size={18} />
                </button>
              ) : (
                <button
                  onClick={() => onEdit(expense.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
              )}
              <button
                onClick={() => onDelete(expense.id)}
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

export default ExpenseTable;