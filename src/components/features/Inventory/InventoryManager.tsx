import React from 'react';
import ProductForm from '../PointOfSale/ProductForm';
import ProductListView from '../PointOfSale/ProductListView';
import { Loader } from 'lucide-react';
import { Product, ProductWithFile } from './types';

interface InventoryManagerProps {
  loading: boolean;
  products: Product[];
  onAddProduct: (product: ProductWithFile) => Promise<void>;
  onUpdateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({
  loading,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ProductForm onSubmit={onAddProduct} />
      <ProductListView
        products={products}
        onUpdate={onUpdateProduct}
        onDelete={onDeleteProduct}
      />
    </div>
  );
};

export default InventoryManager;