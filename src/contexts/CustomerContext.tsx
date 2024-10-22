import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, onSnapshot, query, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from "../components/hooks/use-toast";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  notes: string;
  loyaltyPoints: number;
  status: string;
  hirePurchaseCustomer: boolean;
  createdAt: Date;
}

interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'customers'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Customer));
      setCustomers(customersData);
    }, (error) => {
      console.error("Error fetching customers: ", error);
      toast({
        title: "Error",
        description: "Failed to fetch customers. Please try again.",
        variant: "destructive",
      });
    });
    return () => unsubscribe();
  }, [toast]);

  const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'customers'), { 
        ...customer, 
        createdAt: new Date(),
      });
      toast({
        title: "Success",
        description: "Customer added successfully.",
      });
    } catch (error) {
      console.error("Error adding customer: ", error);
      toast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateCustomer = async (id: string, customer: Partial<Customer>) => {
    try {
      const customerRef = doc(db, 'customers', id);
      await updateDoc(customerRef, customer);
      toast({
        title: "Success",
        description: "Customer updated successfully.",
      });
    } catch (error) {
      console.error("Error updating customer: ", error);
      toast({
        title: "Error",
        description: "Failed to update customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'customers', id));
      toast({
        title: "Success",
        description: "Customer deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting customer: ", error);
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, updateCustomer, deleteCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};