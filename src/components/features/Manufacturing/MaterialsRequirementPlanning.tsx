import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2 } from 'lucide-react';

interface MRPItem {
  id: string;
  itemName: string;
  requiredQuantity: number;
  availableQuantity: number;
  orderQuantity: number;
  expectedDeliveryDate: Date;
  status: 'pending' | 'ordered' | 'received';
}

const MaterialsRequirementPlanning: React.FC = () => {
  const [mrpItems, setMRPItems] = useState<MRPItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<MRPItem, 'id'>>({
    itemName: '',
    requiredQuantity: 0,
    availableQuantity: 0,
    orderQuantity: 0,
    expectedDeliveryDate: new Date(),
    status: 'pending',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'mrpItems'), orderBy('expectedDeliveryDate'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        expectedDeliveryDate: doc.data().expectedDeliveryDate.toDate(),
      } as MRPItem));
      setMRPItems(items);
    });
    return unsubscribe;
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'mrpItems'), {
        ...newItem,
        expectedDeliveryDate: new Date(newItem.expectedDeliveryDate),
      });
      setNewItem({
        itemName: '',
        requiredQuantity: 0,
        availableQuantity: 0,
        orderQuantity: 0,
        expectedDeliveryDate: new Date(),
        status: 'pending',
      });
    } catch (error) {
      console.error("Error adding MRP item: ", error);
    }
  };

  const handleUpdateItem = async (id: string, updatedItem: Partial<MRPItem>) => {
    try {
      await updateDoc(doc(db, 'mrpItems', id), updatedItem);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating MRP item: ", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'mrpItems', id));
    } catch (error) {
      console.error("Error deleting MRP item: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = mrpItems.map(item => 
      `${item.itemName},${item.requiredQuantity},${item.availableQuantity},${item.orderQuantity},${item.expectedDeliveryDate.toISOString()},${item.status}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'mrp_items.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Materials Requirement Planning</h3>
      <form onSubmit={handleAddItem} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.itemName}
            onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Required Quantity"
            value={newItem.requiredQuantity}
            onChange={(e) => setNewItem({ ...newItem, requiredQuantity: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Available Quantity"
            value={newItem.availableQuantity}
            onChange={(e) => setNewItem({ ...newItem, availableQuantity: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Order Quantity"
            value={newItem.orderQuantity}
            onChange={(e) => setNewItem({ ...newItem, orderQuantity: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newItem.expectedDeliveryDate.toISOString().split('T')[0]}
            onChange={(e) => setNewItem({ ...newItem, expectedDeliveryDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <select
            value={newItem.status}
            onChange={(e) => setNewItem({ ...newItem, status: e.target.value as MRPItem['status'] })}
            className="p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="ordered">Ordered</option>
            <option value="received">Received</option>
          </select>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add MRP Item
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
            <th className="py-3 px-6 text-left">Item Name</th>
            <th className="py-3 px-6 text-right">Required Qty</th>
            <th className="py-3 px-6 text-right">Available Qty</th>
            <th className="py-3 px-6 text-right">Order Qty</th>
            <th className="py-3 px-6 text-left">Expected Delivery</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {mrpItems.map((item) => (
            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{item.itemName}</td>
              <td className="py-3 px-6 text-right">{item.requiredQuantity}</td>
              <td className="py-3 px-6 text-right">{item.availableQuantity}</td>
              <td className="py-3 px-6 text-right">{item.orderQuantity}</td>
              <td className="py-3 px-6 text-left">{item.expectedDeliveryDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  item.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                  item.status === 'ordered' ? 'bg-blue-200 text-blue-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(item.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
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

export default MaterialsRequirementPlanning;