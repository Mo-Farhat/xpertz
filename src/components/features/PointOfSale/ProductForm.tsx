import React, { useState } from 'react';
import { Plus, Camera } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface ProductFormProps {
  onSubmit: (product: any) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stock: 0,
    lowStockThreshold: 10,
    imageUrl: '',
    barcode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newProduct);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      lowStockThreshold: 10,
      imageUrl: '',
      barcode: '',
    });
  };

  const handleImageUploaded = (url: string) => {
    setNewProduct(prev => ({ ...prev, imageUrl: url }));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Low Stock Threshold"
          value={newProduct.lowStockThreshold}
          onChange={(e) => setNewProduct({ ...newProduct, lowStockThreshold: parseInt(e.target.value) })}
          className="p-2 border rounded"
        />
        <ImageUpload onImageUploaded={handleImageUploaded} />
        {newProduct.imageUrl && (
          <img src={newProduct.imageUrl} alt="Product" className="w-full h-32 object-cover" />
        )}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Barcode"
            value={newProduct.barcode}
            onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
            className="p-2 border rounded flex-grow mr-2"
          />
          <button
            type="button"
            onClick={() => {/* Implement barcode scanning logic */}}
            className="bg-gray-200 p-2 rounded"
          >
            <Camera size={24} />
          </button>
        </div>
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        <Plus size={24} /> Add Product
      </button>
    </form>
  );
};

export default ProductForm;