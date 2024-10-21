import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2 } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
}

interface PurchaseOrder {
  id: string;
  vendorId: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  items: { itemId: string; quantity: number; unitPrice: number }[];
  status: 'pending' | 'approved' | 'shipped' | 'received' | 'cancelled';
  totalAmount: number;
}

const ProcurementVendorManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [newVendor, setNewVendor] = useState<Omit<Vendor, 'id'>>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    rating: 0,
  });
  const [newPurchaseOrder, setNewPurchaseOrder] = useState<Omit<PurchaseOrder, 'id'>>({
    vendorId: '',
    orderDate: new Date(),
    expectedDeliveryDate: new Date(),
    items: [],
    status: 'pending',
    totalAmount: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const vendorsQuery = query(collection(db, 'vendors'), orderBy('name'));
    const unsubscribeVendors = onSnapshot(vendorsQuery, (querySnapshot) => {
      const vendorData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Vendor));
      setVendors(vendorData);
    });

    const purchaseOrdersQuery = query(collection(db, 'purchaseOrders'), orderBy('orderDate', 'desc'));
    const unsubscribePurchaseOrders = onSnapshot(purchaseOrdersQuery, (querySnapshot) => {
      const poData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        orderDate: doc.data().orderDate.toDate(),
        expectedDeliveryDate: doc.data().expectedDeliveryDate.toDate(),
      } as PurchaseOrder));
      setPurchaseOrders(poData);
    });

    return () => {
      unsubscribeVendors();
      unsubscribePurchaseOrders();
    };
  }, []);

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'vendors'), newVendor);
      setNewVendor({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        rating: 0,
      });
    } catch (error) {
      console.error("Error adding vendor: ", error);
    }
  };

  const handleAddPurchaseOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'purchaseOrders'), {
        ...newPurchaseOrder,
        orderDate: new Date(newPurchaseOrder.orderDate),
        expectedDeliveryDate: new Date(newPurchaseOrder.expectedDeliveryDate),
      });
      setNewPurchaseOrder({
        vendorId: '',
        orderDate: new Date(),
        expectedDeliveryDate: new Date(),
        items: [],
        status: 'pending',
        totalAmount: 0,
      });
    } catch (error) {
      console.error("Error adding purchase order: ", error);
    }
  };

  const handleUpdateVendor = async (id: string, updatedVendor: Partial<Vendor>) => {
    try {
      await updateDoc(doc(db, 'vendors', id), updatedVendor);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating vendor: ", error);
    }
  };

  const handleUpdatePurchaseOrder = async (id: string, updatedPO: Partial<PurchaseOrder>) => {
    try {
      await updateDoc(doc(db, 'purchaseOrders', id), updatedPO);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating purchase order: ", error);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'vendors', id));
    } catch (error) {
      console.error("Error deleting vendor: ", error);
    }
  };

  const handleDeletePurchaseOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'purchaseOrders', id));
    } catch (error) {
      console.error("Error deleting purchase order: ", error);
    }
  };

  const handleExportVendors = () => {
    const csvContent = vendors.map(vendor => 
      `${vendor.name},${vendor.contactPerson},${vendor.email},${vendor.phone},${vendor.address},${vendor.rating}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'vendors.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportPurchaseOrders = () => {
    const csvContent = purchaseOrders.map(po => 
      `${po.id},${po.vendorId},${po.orderDate.toISOString()},${po.expectedDeliveryDate.toISOString()},${po.status},${po.totalAmount}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'purchase_orders.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Procurement & Vendor Management</h3>
      
      {/* Vendors Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-2">Vendors</h4>
        <form onSubmit={handleAddVendor} className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Vendor Name"
              value={newVendor.name}
              onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Contact Person"
              value={newVendor.contactPerson}
              onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newVendor.email}
              onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={newVendor.phone}
              onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Address"
              value={newVendor.address}
              onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Rating"
              value={newVendor.rating}
              onChange={(e) => setNewVendor({ ...newVendor, rating: parseInt(e.target.value) })}
              className="p-2 border rounded"
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <Plus size={24} /> Add Vendor
          </button>
        </form>
        <button
          onClick={handleExportVendors}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Download size={18} className="mr-2" />
          Export Vendors CSV
        </button>
        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Contact Person</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Rating</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{vendor.name}</td>
                <td className="py-3 px-6 text-left">{vendor.contactPerson}</td>
                <td className="py-3 px-6 text-left">{vendor.email}</td>
                <td className="py-3 px-6 text-left">{vendor.phone}</td>
                <td className="py-3 px-6 text-left">{vendor.rating}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => setEditingId(vendor.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteVendor(vendor.id)}
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

      {/* Purchase Orders Section */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Purchase Orders</h4>
        <form onSubmit={handleAddPurchaseOrder} className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              value={newPurchaseOrder.vendorId}
              onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, vendorId: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={newPurchaseOrder.orderDate.toISOString().split('T')[0]}
              onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, orderDate: new Date(e.target.value) })}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={newPurchaseOrder.expectedDeliveryDate.toISOString().split('T')[0]}
              onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, expectedDeliveryDate: new Date(e.target.value) })}
              className="p-2 border rounded"
            />
            <select
              value={newPurchaseOrder.status}
              onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, status: e.target.value as PurchaseOrder['status'] })}
              className="p-2 border rounded"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="shipped">Shipped</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="number"
              placeholder="Total Amount"
              value={newPurchaseOrder.totalAmount}
              onChange={(e) => setNewPurchaseOrder({ ...newPurchaseOrder, totalAmount: parseFloat(e.target.value) })}
              className="p-2 border rounded"
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <Plus size={24} /> Add Purchase Order
          </button>
        </form>
        <button
          onClick={handleExportPurchaseOrders}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Download size={18} className="mr-2" />
          Export Purchase Orders CSV
        </button>
        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Vendor</th>
              <th className="py-3 px-6 text-left">Order Date</th>
              <th className="py-3 px-6 text-left">Expected Delivery</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-right">Total Amount</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {purchaseOrders.map((po) => (
              <tr key={po.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{po.id}</td>
                <td className="py-3 px-6 text-left">{vendors.find(v => v.id === po.vendorId)?.name || 'N/A'}</td>
                <td className="py-3 px-6 text-left">{po.orderDate.toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">{po.expectedDeliveryDate.toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">
                  <span className={`py-1 px-3 rounded-full text-xs ${
                    po.status === 'approved' ? 'bg-green-200 text-green-800' :
                    po.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                    po.status === 'shipped' ? 'bg-blue-200 text-blue-800' :
                    po.status === 'received' ? 'bg-purple-200 text-purple-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {po.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-right">${po.totalAmount.toFixed(2)}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => setEditingId(po.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletePurchaseOrder(po.id)}
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
    </div>
  );
};

export default ProcurementVendorManagement;