import React, { useState, useEffect } from 'react';
import { Plus, Loader } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import ProductList from './PointOfSale/ProductList';
import ProductForm from './PointOfSale/ProductForm';

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  stock: number;
  lowStockThreshold: number;
  imageUrl?: string;
  barcode?: string;
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'inventory'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const inventoryProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        stock: doc.data().quantity, // Map quantity to stock for compatibility
      } as Product));
      setProducts(inventoryProducts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching inventory: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'inventory'), {
        ...newProduct,
        quantity: newProduct.stock, // Map stock to quantity for storage
      });
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const handleUpdateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    // Implement update logic here
  };

  const handleDeleteProduct = async (id: string) => {
    // Implement delete logic here
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Inventory</h2>
      <ProductForm onSubmit={handleAddProduct} />
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader className="animate-spin" size={32} />
        </div>
      ) : (
        <ProductList
          products={products}
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default Inventory;