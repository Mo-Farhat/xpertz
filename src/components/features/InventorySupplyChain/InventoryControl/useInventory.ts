import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useToast } from "../../../hooks/use-toast";
import { Product, ProductWithFile } from '../../Inventory/types';

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'inventory'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const inventoryProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          price: doc.data().price || 0,
          stock: doc.data().quantity || 0,
          quantity: doc.data().quantity || 0,
          minSellingPrice: doc.data().minSellingPrice || 0,
          lowStockThreshold: doc.data().lowStockThreshold || 5,
          imageUrl: doc.data().imageUrl || '',
          barcode: doc.data().barcode || '',
          manufacturer: doc.data().manufacturer || '',
          createdAt: doc.data().createdAt,
          updatedAt: doc.data().updatedAt
        } as Product));
        setProducts(inventoryProducts);
      } catch (error) {
        console.error("Error processing inventory data:", error);
        toast({
          title: "Error",
          description: "Failed to load inventory data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [toast]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'inventory'), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      toast({
        title: "Product added",
        description: "New product has been added to inventory",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'inventory', id), {
        ...updates,
        updatedAt: new Date(),
      });
      toast({
        title: "Product updated",
        description: "Product information has been updated",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inventory', id));
      toast({
        title: "Product deleted",
        description: "Product has been removed from inventory",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};