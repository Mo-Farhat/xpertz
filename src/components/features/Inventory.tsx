import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useToast } from "../hooks/use-toast";
import { uploadLocalImage } from '../../lib/imageUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import InventoryHeader from './Inventory/InventoryHeader';
import InventoryManager from './Inventory/InventoryManager';
import { Product, ProductWithFile } from './Inventory/types';
import InventoryValuationReport from '../Reports/Inventory/InventoryValuationReport';
import StockMovementReport from '../Reports/Inventory/StockMovementReport';
import AgingInventoryReport from '../Reports/Inventory/Aging/AgingInventoryReport';
import InventoryTurnoverReport from '../Reports/Inventory/InventoryTurnoverReport';
import StockLevelsReport from '../Reports/Inventory/StockLevelsReport';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'inventory'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const inventoryProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        stock: doc.data().quantity,
      } as Product));
      setProducts(inventoryProducts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching inventory: ", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch inventory",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [toast]);

  const handleAddProduct = async (newProduct: ProductWithFile) => {
    try {
      setLoading(true);
      let imageUrl = newProduct.imageUrl;
      
      if (newProduct.imageFile) {
        imageUrl = await uploadLocalImage(newProduct.imageFile);
      }

      const productData = {
        name: newProduct.name,
        price: Number(newProduct.price),
        quantity: Number(newProduct.stock),
        stock: Number(newProduct.stock),
        lowStockThreshold: Number(newProduct.lowStockThreshold),
        imageUrl: imageUrl || '',
        barcode: newProduct.barcode || '',
        manufacturer: newProduct.manufacturer || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'inventory'), productData);
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      console.error("Error adding product: ", error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeDetected = async (barcode: string) => {
    try {
      const q = query(collection(db, 'inventory'), where('barcode', '==', barcode));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        toast({
          title: "Product Found",
          description: `Found product with barcode: ${barcode}`,
        });
        const productId = querySnapshot.docs[0].id;
        const element = document.getElementById(`product-${productId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          element.classList.add('bg-yellow-100');
          setTimeout(() => element.classList.remove('bg-yellow-100'), 2000);
        }
      } else {
        toast({
          title: "Product Not Found",
          description: `No product found with barcode: ${barcode}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching for barcode:", error);
      toast({
        title: "Error",
        description: "Failed to search for product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    try {
      setLoading(true);
      const productRef = doc(db, 'inventory', id);
      await updateDoc(productRef, {
        ...updatedProduct,
        updatedAt: new Date()
      });
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      console.error("Error updating product: ", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'inventory', id));
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product: ", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <InventoryHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onBarcodeDetected={handleBarcodeDetected}
      />
      
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          <TabsTrigger value="valuation">Inventory Valuation</TabsTrigger>
          <TabsTrigger value="aging">Stock Aging</TabsTrigger>
          <TabsTrigger value="turnover">Inventory Turnover</TabsTrigger>
          <TabsTrigger value="movement">Stock Movement</TabsTrigger>
          <TabsTrigger value="levels">Stock Levels</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          <InventoryManager
            loading={loading}
            products={filteredProducts}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </TabsContent>
        
        <TabsContent value="valuation">
          <InventoryValuationReport />
        </TabsContent>
        
        <TabsContent value="aging">
          <AgingInventoryReport />
        </TabsContent>

        <TabsContent value="turnover">
          <InventoryTurnoverReport />
        </TabsContent>

        <TabsContent value="movement">
          <StockMovementReport />
        </TabsContent>

        <TabsContent value="levels">
          <StockLevelsReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;