import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2 } from 'lucide-react';

interface WorkOrder {
  id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo: string;
}

const WorkOrderManagement: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [newWorkOrder, setNewWorkOrder] = useState<Omit<WorkOrder, 'id'>>({
    orderNumber: '',
    productName: '',
    quantity: 0,
    startDate: new Date(),
    endDate: new Date(),
    status: 'pending',
    assignedTo: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'workOrders'), orderBy('startDate'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orderData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
      } as WorkOrder));
      setWorkOrders(orderData);
    });
    return unsubscribe;
  }, []);

  const handleAddWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'workOrders'), {
        ...newWorkOrder,
        startDate: new Date(newWorkOrder.startDate),
        endDate: new Date(newWorkOrder.endDate),
      });
      setNewWorkOrder({
        orderNumber: '',
        productName: '',
        quantity: 0,
        startDate: new Date(),
        endDate: new Date(),
        status: 'pending',
        assignedTo: '',
      });
    } catch (error) {
      console.error("Error adding work order: ", error);
    }
  };

  const handleUpdateWorkOrder = async (id: string, updatedOrder: Partial<WorkOrder>) => {
    try {
      await updateDoc(doc(db, 'workOrders', id), updatedOrder);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating work order: ", error);
    }
  };

  const handleDeleteWorkOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'workOrders', id));
    } catch (error) {
      console.error("Error deleting work order: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = workOrders.map(order => 
      `${order.orderNumber},${order.productName},${order.quantity},${order.startDate.toISOString()},${order.endDate.toISOString()},${order.status},${order.assignedTo}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'work_orders.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Work Order Management</h3>
      <form onSubmit={handleAddWorkOrder} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Order Number"
            value={newWorkOrder.orderNumber}
            onChange={(e) => setNewWorkOrder({ ...newWorkOrder, orderNumber: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Product Name"
            value={newWorkOrder.productName}
            onChange={(e) => setNewWorkOrder({ ...newWorkOrder, productName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newWorkOrder.quantity}
            onChange={(e) => setNewWorkOrder({ ...newWorkOrder, quantity: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newWorkOrder.startDate.toISOString().split('T')[0]}
            onChange={(e) => setNewWorkOrder({ ...newWorkOrder, startDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newWorkOrder.endDate.toISOString().split('T')[0]}
            onChange={(e) => setNewWorkOrder({ ...newWorkOrder, endDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <select
            value={newWorkOrder.status}
            onChange={(e) => setNewWorkOrder({ ...newWorkOrder, status: e.target.value as WorkOrder['status'] })}
            className="p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="text"
            placeholder="Assigned To"
            value={newWorkOrder.assignedTo}
            onChange={(e) => setNewWorkOrder({ ...newWorkOrder, assignedTo: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Work Order
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
            <th className="py-3 px-6 text-left">Order Number</th>
            <th className="py-3 px-6 text-left">Product</th>
            <th className="py-3 px-6 text-right">Quantity</th>
            <th className="py-3 px-6 text-left">Start Date</th>
            <th className="py-3 px-6 text-left">End Date</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Assigned To</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {workOrders.map((order) => (
            <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{order.orderNumber}</td>
              <td className="py-3 px-6 text-left">{order.productName}</td>
              <td className="py-3 px-6 text-right">{order.quantity}</td>
              <td className="py-3 px-6 text-left">{order.startDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">{order.endDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                  order.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
                  order.status === 'completed' ? 'bg-green-200 text-green-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="py-3 px-6 text-left">{order.assignedTo}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(order.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteWorkOrder(order.id)}
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

export default WorkOrderManagement;