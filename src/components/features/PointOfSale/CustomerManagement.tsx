import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Edit, Trash2, User } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id' | 'loyaltyPoints'>>({
    name: '',
    email: '',
    phone: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'customers'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Customer));
      setCustomers(customersData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'customers'), { ...newCustomer, loyaltyPoints: 0 });
      setNewCustomer({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error("Error adding customer: ", error);
    }
  };

  const handleUpdateCustomer = async (id: string, updatedCustomer: Partial<Customer>) => {
    try {
      await updateDoc(doc(db, 'customers', id), updatedCustomer);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating customer: ", error);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'customers', id));
    } catch (error) {
      console.error("Error deleting customer: ", error);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Customer Management</h3>
      <form onSubmit={handleAddCustomer} className="mb-4">
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Customer
        </button>
      </form>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Phone</th>
            <th className="py-3 px-6 text-right">Loyalty Points</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <User size={18} className="inline mr-2" />
                {customer.name}
              </td>
              <td className="py-3 px-6 text-left">{customer.email}</td>
              <td className="py-3 px-6 text-left">{customer.phone}</td>
              <td className="py-3 px-6 text-right">{customer.loyaltyPoints}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(customer.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer.id)}
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

export default CustomerManagement;