import React from 'react';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Product } from './types';

interface ProductListViewProps {
  products: Product[];
  onUpdate: (id: string, product: Partial<Product>) => void;
  onDelete: (id: string) => void;
}

const ProductListView: React.FC<ProductListViewProps> = ({ products, onUpdate, onDelete }) => {
  return (
    <table className="w-full bg-white shadow-md rounded">
      <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-3 px-6 text-left">Image</th>
          <th className="py-3 px-6 text-left">Name</th>
          <th className="py-3 px-6 text-right">Quantity</th>
          <th className="py-3 px-6 text-right">Price</th>
          <th className="py-3 px-6 text-right">Min. Price</th>
          <th className="py-3 px-6 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {products.map((product) => (
          <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-12 h-12 object-cover mb-2 rounded"
                />
              )}
            </td>
            <td className="py-3 px-6 text-left whitespace-nowrap">
              {product.quantity <= product.lowStockThreshold && (
                <AlertTriangle size={18} className="inline text-yellow-500 mr-2" />
              )}
              {product.name}
            </td>
            <td className="py-3 px-6 text-right">{product.quantity}</td>
            <td className="py-3 px-6 text-right">${product.price.toFixed(2)}</td>
            <td className="py-3 px-6 text-right text-red-600">${product.minSellingPrice.toFixed(2)}</td>
            <td className="py-3 px-6 text-center">
              <button
                onClick={() => onUpdate(product.id, {})}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductListView;