import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2, Barcode } from 'lucide-react';

interface BarcodeItem {
  id: string;
  itemId: string;
  itemName: string;
  barcode: string;
  rfidTag?: string;
  lastScanned?: Date;
}

const BarcodeRFID: React.FC = () => {
  const [barcodeItems, setBarcodeItems] = useState<BarcodeItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<BarcodeItem, 'id'>>({
    itemId: '',
    itemName: '',
    barcode: '',
    rfidTag: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'barcodeItems'), orderBy('itemName'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastScanned: doc.data().lastScanned?.toDate(),
      } as BarcodeItem));
      setBarcodeItems(items);
    });
    return unsubscribe;
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'barcodeItems'), newItem);
      setNewItem({
        itemId: '',
        itemName: '',
        barcode: '',
        rfidTag: '',
      });
    } catch (error) {
      console.error("Error adding barcode item: ", error);
    }
  };

  const handleUpdateItem = async (id: string, updatedItem: Partial<BarcodeItem>) => {
    try {
      await updateDoc(doc(db, 'barcodeItems', id), updatedItem);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating barcode item: ", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'barcodeItems', id));
    } catch (error) {
      console.error("Error deleting barcode item: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = barcodeItems.map(item => 
      `${item.itemId},${item.itemName},${item.barcode},${item.rfidTag || ''},${item.lastScanned?.toISOString() || ''}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'barcode_rfid_items.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Barcode/RFID Management</h3>
      <form onSubmit={handleAddItem} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Item ID"
            value={newItem.itemId}
            onChange={(e) => setNewItem({ ...newItem, itemId: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.itemName}
            onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Barcode"
            value={newItem.barcode}
            onChange={(e) => setNewItem({ ...newItem, barcode: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="RFID Tag (optional)"
            value={newItem.rfidTag}
            onChange={(e) => setNewItem({ ...newItem, rfidTag: e.target.value })}
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
            <th className="py-3 px-6 text-left">Item ID</th>
            <th className="py-3 px-6 text-left">Item Name</th>
            <th className="py-3 px-6 text-left">Barcode</th>
            <th className="py-3 px-6 text-left">RFID Tag</th>
            <th className="py-3 px-6 text-left">Last Scanned</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {barcodeItems.map((item) => (
            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{item.itemId}</td>
              <td className="py-3 px-6 text-left">{item.itemName}</td>
              <td className="py-3 px-6 text-left">{item.barcode}</td>
              <td className="py-3 px-6 text-left">{item.rfidTag || 'N/A'}</td>
              <td className="py-3 px-6 text-left">{item.lastScanned?.toLocaleString() || 'Never'}</td>
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

export default BarcodeRFID;