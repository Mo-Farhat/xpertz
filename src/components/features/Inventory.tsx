import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  getDocs,
  DocumentData 
} from 'firebase/firestore';
import { db } from '../../firebase';
import ProductList from './PointOfSale/ProductList';
import ProductForm from './PointOfSale/ProductForm';
import BarcodeForm from './BarcodeForm';
import { useToast } from "../hooks/use-toast";
import { Product } from './PointOfSale/types';
import { uploadLocalImage } from '../../lib/imageUtils';
import SearchBar from '../shared/searchBar';

interface ProductWithFile extends Omit<Product, 'id'> {
  imageFile?: File;
}

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
        try {
          imageUrl = await uploadLocalImage(newProduct.imageFile);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          toast({
            title: "Error",
            description: "Failed to upload product image. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }
      // Prepare the product data for Firestore
      const productData = {
        name: newProduct.name,
        price: Number(newProduct.price),
        quantity: Number(newProduct.stock), // Store stock as quantity in Firestore
        stock: Number(newProduct.stock),
        lowStockThreshold: Number(newProduct.lowStockThreshold),
        imageUrl: imageUrl || '',
        barcode: newProduct.barcode || '',
        manufacturer: newProduct.manufacturer || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (!newProduct.name || newProduct.price <= 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields correctly.",
          variant: "destructive",
        });
        return;
      }


      const docRef = await addDoc(collection(db, 'inventory'), productData);
      
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

  const handleAddToCart = (product: Product) => {
    console.log('Add to cart functionality not implemented in inventory view:', product);
  };

  const handleUpdateProduct = (id: string, product: Partial<Product>) => {
    console.log('Update product functionality not implemented:', id, product);
  };

  const handleDeleteProduct = (id: string) => {
    console.log('Delete product functionality not implemented:', id);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Inventory</h2>
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search products by name or barcode..."
      />
      <BarcodeForm onBarcodeDetected={handleBarcodeDetected} />
      <ProductForm onSubmit={handleAddProduct} />
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader className="animate-spin" size={32} />
        </div>
      ) : (
        <ProductList
          products={filteredProducts}
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default Inventory;