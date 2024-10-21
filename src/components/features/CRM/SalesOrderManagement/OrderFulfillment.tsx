import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Plus, Download, Edit, Trash2, Truck } from 'lucide-react';

interface FulfillmentOrder {
  id: string;
  orderId: string;
  customerName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingMethod: string;
  trackingNumber: string;
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  createdAt: Date;
}

const OrderFulfillment: React.FC = () => {
  const [fulfillments, setFulfillments] = useState<FulfillmentOrder[]>([]);
  const [newFulfillment, setNewFulfillment] = useState<Omit<FulfillmentOrder, 'id' | 'createdAt'>>({
    orderId: '',
    customerName: '',
    status: 'pending',
    shippingMethod: '',
    trackingNumber: '',
    estimatedDeliveryDate: new Date(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'orderFulfillments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fulfillmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        estimatedDeliveryDate: doc.data().estimatedDeliveryDate.toDate(),
        actualDeliveryDate: doc.data().actualDeliveryDate?.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      } as FulfillmentOrder));
      setFulfillments(fulfillmentsData);
    });
    return unsubscribe;
  }, []);

  const handleAddFulfillment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'orderFulfillments'), {
        ...newFulfillment,
        createdAt: new Date(),
      });
      setNewFulfillment({
        orderId: '',
        customerName: '',
        status: 'pending',
        shippingMethod: '',
        trackingNumber: '',
        estimatedDeliveryDate: new Date(),
      });
    } catch (error) {
      console.error("Error adding fulfillment: ", error);
    }
  };

  const handleUpdateFulfillment = async (id: string, updatedFulfillment: Partial<FulfillmentOrder>) => {
    try {
      await updateDoc(doc(db, 'orderFulfillments', id), updatedFulfillment);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating fulfillment: ", error);
    }
  };

  const handleDeleteFulfillment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'orderFulfillments', id));
    } catch (error) {
      console.error("Error deleting fulfillment: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = fulfillments.map(fulfillment => 
      `${fulfillment.orderId},${fulfillment.customerName},${fulfillment.status},${fulfillment.shippingMethod},${fulfillment.trackingNumber},${fulfillment.estimatedDeliveryDate.toISOString()},${fulfillment.actualDeliveryDate?.toISOString() || ''},${fulfillment.createdAt.toISOString()}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'order_fulfillments.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Order Fulfillment</h3>
      <form onSubmit={handleAddFulfillment} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Order ID"
            value={newFulfillment.orderId}
            onChange={(e) => setNewFulfillment({ ...newFulfillment, orderId: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Customer Name"
            value={newFulfillment.customerName}
            onChange={(e) => setNewFulfillment({ ...newFulfillment, customerName: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={newFulfillment.status}
            onChange={(e) => setNewFulfillment({ ...newFulfillment, status: e.target.value as FulfillmentOrder['status'] })}
            className="p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <input
            type="text"
            placeholder="Shipping Method"
            value={newFulfillment.shippingMethod}
            onChange={(e) => setNewFulfillment({ ...newFulfillment, shippingMethod: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Tracking Number"
            value={newFulfillment.trackingNumber}
            onChange={(e) => setNewFulfillment({ ...newFulfillment, trackingNumber: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newFulfillment.estimatedDeliveryDate.toISOString().split('T')[0]}
            onChange={(e) => setNewFulfillment({ ...newFulfillment, estimatedDeliveryDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Fulfillment
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
            <th className="py-3 px-6 text-left">Order ID</th>
            <th className="py-3 px-6 text-left">Customer</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Shipping Method</th>
            <th className="py-3 px-6 text-left">Tracking Number</th>
            <th className="py-3 px-6 text-left">Est. Delivery</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {fulfillments.map((fulfillment) => (
            <tr key={fulfillment.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{fulfillment.orderId}</td>
              <td className="py-3 px-6 text-left">{fulfillment.customerName}</td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  fulfillment.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                  fulfillment.status === 'processing' ? 'bg-blue-200 text-blue-800' :
                  fulfillment.status === 'shipped' ? 'bg-purple-200 text-purple-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {fulfillment.status}
                </span>
              </td>
              <td className="py-3 px-6 text-left">{fulfillment.shippingMethod}</td>
              <td className="py-3 px-6 text-left">{fulfillment.trackingNumber}</td>
              <td className="py-3 px-6 text-left">{fulfillment.estimatedDeliveryDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(fulfillment.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteFulfillment(fulfillment.id)}
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

export default OrderFulfillment;