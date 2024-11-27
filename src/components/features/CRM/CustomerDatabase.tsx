import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Download } from 'lucide-react';
import { Button } from "../../ui/button";
import { useToast } from "../../hooks/use-toast";
import { Customer, CustomerFormData } from './CustomerDatabase/types';
import CustomerForm from './CustomerDatabase/CustomerForm';
import CustomerTable from './CustomerDatabase/CustomerTable';

const CustomerDatabase: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
    type: 'regular',
    status: 'active',
    loyaltyPoints: 0,
    hirePurchaseCustomer: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up customers listener');
    const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as Customer));
      console.log('Received customers data:', customersData);
      setCustomers(customersData);
    });
    return unsubscribe;
  }, []);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        console.log('Updating customer:', editingId, newCustomer);
        await updateDoc(doc(db, 'customers', editingId), newCustomer);
        setEditingId(null);
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
      } else {
        console.log('Adding new customer:', newCustomer);
        await addDoc(collection(db, 'customers'), {
          ...newCustomer,
          createdAt: new Date(),
        });
        toast({
          title: "Success",
          description: "Customer added successfully",
        });
      }
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        notes: '',
        type: 'regular',
        status: 'active',
        loyaltyPoints: 0,
        hirePurchaseCustomer: false
      });
    } catch (error) {
      console.error("Error managing customer: ", error);
      toast({
        title: "Error",
        description: "Failed to manage customer",
        variant: "destructive",
      });
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    console.log('Editing customer:', customer);
    setEditingId(customer.id);
    setNewCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      address: customer.address,
      notes: customer.notes,
      type: customer.type,
      status: customer.status,
      loyaltyPoints: customer.loyaltyPoints,
      hirePurchaseCustomer: customer.hirePurchaseCustomer
    });
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      console.log('Deleting customer:', id);
      await deleteDoc(doc(db, 'customers', id));
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting customer: ", error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csvContent = customers.map(customer => 
      `${customer.name},${customer.email},${customer.phone},${customer.company},${customer.type},${customer.address},${customer.notes},${customer.createdAt.toISOString()}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'customers.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Customer Database</h3>
        <Button onClick={handleExport} className="bg-green-500 hover:bg-green-600">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <CustomerForm
        customer={newCustomer}
        onCustomerChange={setNewCustomer}
        onSubmit={handleAddCustomer}
        isEditing={!!editingId}
      />

      <CustomerTable
        customers={customers}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
      />
    </div>
  );
};

export default CustomerDatabase;