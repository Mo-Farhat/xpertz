import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Supplier } from '../types';
import SupplierForm from './SupplierForm';
import SupplierList from './SupplierList';
import { useToast } from "../../../hooks/use-toast";

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'suppliers'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const suppliersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Supplier));
      setSuppliers(suppliersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching suppliers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch suppliers",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleAddSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    try {
      await addDoc(collection(db, 'suppliers'), supplier);
      toast({
        title: "Success",
        description: "Supplier added successfully",
      });
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast({
        title: "Error",
        description: "Failed to add supplier",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSupplier = async (id: string, supplier: Partial<Supplier>) => {
    try {
      await updateDoc(doc(db, 'suppliers', id), supplier);
      toast({
        title: "Success",
        description: "Supplier updated successfully",
      });
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast({
        title: "Error",
        description: "Failed to update supplier",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'suppliers', id));
      toast({
        title: "Success",
        description: "Supplier deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast({
        title: "Error",
        description: "Failed to delete supplier",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <SupplierForm onSubmit={handleAddSupplier} />
      <SupplierList 
        suppliers={suppliers}
        onUpdate={handleUpdateSupplier}
        onDelete={handleDeleteSupplier}
      />
    </div>
  );
};

export default SupplierManagement;
