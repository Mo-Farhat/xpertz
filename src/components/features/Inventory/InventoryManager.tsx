import React from 'react';
import ProductForm from '../PointOfSale/ProductForm';
import ProductList from '../PointOfSale/ProductList';
import { Loader } from 'lucide-react';
import { Product } from './types';

interface InventoryManagerProps {
  loading: boolean;
  products: Product[];
  onAddProduct: (product: any) => Promise<void>;
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
  return (
    <div className="space-y-4">
      <ProductForm onSubmit={onAddProduct} />
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader className="animate-spin" size={32} />
        </div>
      ) : (
        <ProductList
          products={products}
          onUpdate={onUpdateProduct}
          onDelete={onDeleteProduct}
        />
      )}
    </div>
  );
};

export default InventoryManager;