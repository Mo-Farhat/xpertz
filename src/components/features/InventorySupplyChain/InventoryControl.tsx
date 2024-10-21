import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2 } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorderPoint: number;
  unitCost: number;
  location: string;
}

const InventoryControl: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    sku: '',
    quantity: 0,
    reorderPoint: 0,
    unitCost: 0,
    location: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'inventoryItems'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as InventoryItem));
      setInventoryItems(items);
    });
    return unsubscribe;
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'inventoryItems'), newItem);
      setNewItem({
        name: '',
        sku: '',
        quantity: 0,
        reorderPoint: 0,
        unitCost: 0,
        location: '',
      });
    } catch (error) {
      console.error("Error adding inventory item: ", error);
    }
  };

  const handleUpdateItem = async (id: string, updatedItem: Partial<InventoryItem>) => {
    try {
      await updateDoc(doc(db, 'inventoryItems', id), updatedItem);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating inventory item: ", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inventoryItems', id));
    } catch (error) {
      console.error("Error deleting inventory item: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = inventoryItems.map(item => 
      `${item.name},${item.sku},${item.quantity},${item.reorderPoint},${item.unitCost},${item.location}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'inventory_items.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Inventory Control</h3>
      <form onSubmit={handleAddItem} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="SKU"
            value={newItem.sku}
            onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Reorder Point"
            value={newItem.reorderPoint}
            onChange={(e) => setNewItem({ ...newItem, reorderPoint: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Unit Cost"
            value={newItem.unitCost}
            onChange={(e) => setNewItem({ ...newItem, unitCost: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Location"
            value={newItem.location}
            onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Item
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
            <th className="py-3 px-6 text-left">SKU</th>
            <th className="py-3 px-6 text-right">Quantity</th>
            <th className="py-3 px-6 text-right">Reorder Point</th>
            <th className="py-3 px-6 text-right">Unit Cost</th>
            <th className="py-3 px-6 text-left">Location</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {inventoryItems.map((item) => (
            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{item.name}</td>
              <td className="py-3 px-6 text-left">{item.sku}</td>
              <td className="py-3 px-6 text-right">{item.quantity}</td>
              <td className="py-3 px-6 text-right">{item.reorderPoint}</td>
              <td className="py-3 px-6 text-right">${item.unitCost.toFixed(2)}</td>
              <td className="py-3 px-6 text-left">{item.location}</td>
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

export default InventoryControl;