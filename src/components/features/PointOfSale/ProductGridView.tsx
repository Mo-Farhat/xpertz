import React from 'react';
import { Card } from "../../../components/ui/card";
import { Product } from './types';

interface ProductGridViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductGridView: React.FC<ProductGridViewProps> = ({ products, onAddToCart }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          onClick={() => onAddToCart(product)}
        >
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-32 object-cover mb-2 rounded"
            />
          )}
          <h3 className="font-semibold truncate">{product.name}</h3>
          <p className="text-green-600">${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Stock: {product.stock}</p>
          {product.barcode && (
            <p className="text-xs text-gray-500 truncate">Barcode: {product.barcode}</p>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ProductGridView;