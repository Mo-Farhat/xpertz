import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useToast } from "./use-toast";
import { Supplier } from '../../components/features/Purchase/types';
import { PurchaseOrderItem } from '../../components/features/Purchase/PurchaseOrder/types/purchaseOrderTypes';
import { Product } from '../../components/features/Inventory/types';

export const usePurchaseOrderForm = () => {
    const { toast } = useToast();
    const [items, setItems] = useState<PurchaseOrderItem[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [terms, setTerms] = useState('');
    const [notes, setNotes] = useState('');
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch suppliers
          const suppliersQuery = query(collection(db, 'suppliers'));
          const suppliersUnsubscribe = onSnapshot(suppliersQuery, (snapshot) => {
            const suppliersData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as Supplier));
            setSuppliers(suppliersData);
          });
  
          // Fetch products
          const productsQuery = query(collection(db, 'inventory'));
          const productsUnsubscribe = onSnapshot(productsQuery, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as Product));
            setProducts(productsData);
          });
  
          return () => {
            suppliersUnsubscribe();
            productsUnsubscribe();
          };
        } catch (error) {
          console.error('Error fetching data:', error);
          toast({
            title: "Error",
            description: "Failed to fetch suppliers and products",
            variant: "destructive",
          });
        }
      };
  
      fetchData();
    }, [toast]);
  
    return {
      suppliers,
      products,
      items,
      setItems,
      selectedSupplier,
      setSelectedSupplier,
      terms,
      setTerms,
      notes,
      setNotes
    };
  };