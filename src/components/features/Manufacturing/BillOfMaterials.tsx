import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2 } from 'lucide-react';

interface BOMItem {
  id: string;
  productName: string;
  componentName: string;
  quantity: number;
  unit: string;
}

const BillOfMaterials: React.FC = () => {
  const [bomItems, setBOMItems] = useState<BOMItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<BOMItem, 'id'>>({
    productName: '',
    componentName: '',
    quantity: 0,
    unit: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'billOfMaterials'), orderBy('productName'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as BOMItem));
      setBOMItems(items);
    });
    return unsubscribe;
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'billOfMaterials'), newItem);
      setNewItem({
        productName: '',
        componentName: '',
        quantity: 0,
        unit: '',
      });
    } catch (error) {
      console.error("Error adding BOM item: ", error);
    }
  };

  const handleUpdateItem = async (id: string, updatedItem: Partial<BOMItem>) => {
    try {
      await updateDoc(doc(db, 'billOfMaterials', id), updatedItem);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating BOM item: ", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'billOfMaterials', id));
    } catch (error) {
      console.error("Error deleting BOM item: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = bomItems.map(item => 
      `${item.productName},${item.componentName},${item.quantity},${item.unit}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'bill_of_materials.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Bill of Materials</h3>
      <form onSubmit={handleAddItem} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newItem.productName}
            onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Component Name"
            value={newItem.componentName}
            onChange={(e) => setNewItem({ ...newItem, componentName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Unit"
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add BOM Item
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
            <th className="py-3 px-6 text-left">Component Name</th>
            <th className="py-3 px-6 text-right">Quantity</th>
            <th className="py-3 px-6 text-left">Unit</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {bomItems.map((item) => (
            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{item.productName}</td>
              <td className="py-3 px-6 text-left">{item.componentName}</td>
              <td className="py-3 px-6 text-right">{item.quantity}</td>
              <td className="py-3 px-6 text-left">{item.unit}</td>
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

export default BillOfMaterials;