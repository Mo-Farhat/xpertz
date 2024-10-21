import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Plus, Download, Edit, Trash2, Package } from 'lucide-react';

interface SalesOrder {
  id: string;
  customerName: string;
  orderDate: Date;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'quote' | 'order' | 'invoice' | 'paid';
  createdAt: Date;
}

const SalesOrderCreation: React.FC = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [newOrder, setNewOrder] = useState<Omit<SalesOrder, 'id' | 'createdAt'>>({
    customerName: '',
    orderDate: new Date(),
    items: [],
    totalAmount: 0,
    status: 'quote',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'salesOrders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        orderDate: doc.data().orderDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      } as SalesOrder));
      setOrders(ordersData);
    });
    return unsubscribe;
  }, []);

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'salesOrders'), {
        ...newOrder,
        createdAt: new Date(),
      });
      setNewOrder({
        customerName: '',
        orderDate: new Date(),
        items: [],
        totalAmount: 0,
        status: 'quote',
      });
    } catch (error) {
      console.error("Error adding order: ", error);
    }
  };

  const handleUpdateOrder = async (id: string, updatedOrder: Partial<SalesOrder>) => {
    try {
      await updateDoc(doc(db, 'salesOrders', id), updatedOrder);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating order: ", error);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'salesOrders', id));
    } catch (error) {
      console.error("Error deleting order: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = orders.map(order => 
      `${order.customerName},${order.orderDate.toISOString()},${order.totalAmount},${order.status},${order.createdAt.toISOString()}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'sales_orders.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Sales Order Creation</h3>
      <form onSubmit={handleAddOrder} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={newOrder.customerName}
            onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newOrder.orderDate.toISOString().split('T')[0]}
            onChange={(e) => setNewOrder({ ...newOrder, orderDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Total Amount"
            value={newOrder.totalAmount}
            onChange={(e) => setNewOrder({ ...newOrder, totalAmount: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <select
            value={newOrder.status}
            onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value as SalesOrder['status'] })}
            className="p-2 border rounded"
          >
            <option value="quote">Quote</option>
            <option value="order">Order</option>
            <option value="invoice">Invoice</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Order
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
            <th className="py-3 px-6 text-left">Customer</th>
            <th className="py-3 px-6 text-left">Order Date</th>
            <th className="py-3 px-6 text-right">Total Amount</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{order.customerName}</td>
              <td className="py-3 px-6 text-left">{order.orderDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-right">${order.totalAmount.toFixed(2)}</td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  order.status === 'quote' ? 'bg-yellow-200 text-yellow-800' :
                  order.status === 'order' ? 'bg-blue-200 text-blue-800' :
                  order.status === 'invoice' ? 'bg-purple-200 text-purple-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(order.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteOrder(order.id)}
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

export default SalesOrderCreation;