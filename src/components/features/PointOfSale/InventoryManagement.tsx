import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

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

const InventoryManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'inventory'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        stock: doc.data().quantity, // Map quantity to stock for compatibility
      } as Product));
      setProducts(productsData);
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
    try {
      const productToUpdate = { ...updatedProduct };
      if ('stock' in productToUpdate) {
        productToUpdate.quantity = productToUpdate.stock;
        delete productToUpdate.stock;
      }
      await updateDoc(doc(db, 'inventory', id), productToUpdate);
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inventory', id));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm)
  );

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Inventory Management</h3>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>
      <ProductForm onSubmit={handleAddProduct} />
      <ProductList
        products={filteredProducts}
        onUpdate={handleUpdateProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default InventoryManagement;