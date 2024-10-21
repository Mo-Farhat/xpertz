import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2, Truck } from 'lucide-react';

interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'returned';
  shippingDate: Date;
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
}

const ShippingLogistics: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [newShipment, setNewShipment] = useState<Omit<Shipment, 'id'>>({
    orderId: '',
    carrier: '',
    trackingNumber: '',
    status: 'pending',
    shippingDate: new Date(),
    estimatedDeliveryDate: new Date(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'shipments'), orderBy('shippingDate', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const shipmentData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        shippingDate: doc.data().shippingDate.toDate(),
        estimatedDeliveryDate: doc.data().estimatedDeliveryDate.toDate(),
        actualDeliveryDate: doc.data().actualDeliveryDate?.toDate(),
      } as Shipment));
      setShipments(shipmentData);
    });
    return unsubscribe;
  }, []);

  const handleAddShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'shipments'), {
        ...newShipment,
        shippingDate: new Date(newShipment.shippingDate),
        estimatedDeliveryDate: new Date(newShipment.estimatedDeliveryDate),
      });
      setNewShipment({
        orderId: '',
        carrier: '',
        trackingNumber: '',
        status: 'pending',
        shippingDate: new Date(),
        estimatedDeliveryDate: new Date(),
      });
    } catch (error) {
      console.error("Error adding shipment: ", error);
    }
  };

  const handleUpdateShipment = async (id: string, updatedShipment: Partial<Shipment>) => {
    try {
      await updateDoc(doc(db, 'shipments', id), updatedShipment);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating shipment: ", error);
    }
  };

  const handleDeleteShipment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'shipments', id));
    } catch (error) {
      console.error("Error deleting shipment: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = shipments.map(shipment => 
      `${shipment.orderId},${shipment.carrier},${shipment.trackingNumber},${shipment.status},${shipment.shippingDate.toISOString()},${shipment.estimatedDeliveryDate.toISOString()},${shipment.actualDeliveryDate?.toISOString() || ''}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'shipments.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Shipping & Logistics</h3>
      <form onSubmit={handleAddShipment} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Order ID"
            value={newShipment.orderId}
            onChange={(e) => setNewShipment({ ...newShipment, orderId: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Carrier"
            value={newShipment.carrier}
            onChange={(e) => setNewShipment({ ...newShipment, carrier: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Tracking Number"
            value={newShipment.trackingNumber}
            onChange={(e) => setNewShipment({ ...newShipment, trackingNumber: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={newShipment.status}
            onChange={(e) => setNewShipment({ ...newShipment, status: e.target.value as Shipment['status'] })}
            className="p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
          </select>
          <input
            type="date"
            value={newShipment.shippingDate.toISOString().split('T')[0]}
            onChange={(e) => setNewShipment({ ...newShipment, shippingDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newShipment.estimatedDeliveryDate.toISOString().split('T')[0]}
            onChange={(e) => setNewShipment({ ...newShipment, estimatedDeliveryDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Shipment
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
            <th className="py-3 px-6 text-left">Carrier</th>
            <th className="py-3 px-6 text-left">Tracking Number</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Shipping Date</th>
            <th className="py-3 px-6 text-left">Est. Delivery Date</th>
            <th className="py-3 px-6 text-left">Actual Delivery Date</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{shipment.orderId}</td>
              <td className="py-3 px-6 text-left">{shipment.carrier}</td>
              <td className="py-3 px-6 text-left">{shipment.trackingNumber}</td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  shipment.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                  shipment.status === 'in-transit' ? 'bg-blue-200 text-blue-800' :
                  shipment.status === 'delivered' ? 'bg-green-200 text-green-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {shipment.status}
                </span>
              </td>
              <td className="py-3 px-6 text-left">{shipment.shippingDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">{shipment.estimatedDeliveryDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">{shipment.actualDeliveryDate?.toLocaleDateString() || 'N/A'}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(shipment.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteShipment(shipment.id)}
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

export default ShippingLogistics;