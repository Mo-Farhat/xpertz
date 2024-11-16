import React, { useState } from 'react';
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import ImageUpload from './ImageUpload';
import { ProductWithFile } from '../Inventory/types';

interface ProductFormProps {
  onSubmit: (product: ProductWithFile) => Promise<void>;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit }) => {
  const [product, setProduct] = useState<ProductWithFile>({
    name: '',
    quantity: 0,
    price: 0,
    minSellingPrice: 0,
    stock: 0,
    lowStockThreshold: 0,
    imageUrl: '',
    imageFile: undefined,
    barcode: '',
    manufacturer: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(product);
    setProduct({
      name: '',
      quantity: 0,
      price: 0,
      minSellingPrice: 0,
      stock: 0,
      lowStockThreshold: 0,
      imageUrl: '',
      imageFile: undefined,
      barcode: '',
      manufacturer: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Price"
              value={product.price || ''}
              onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
              required
              min="0"
              step="0.01"
            />
            <Input
              type="number"
              placeholder="Minimum Selling Price"
              value={product.minSellingPrice || ''}
              onChange={(e) => setProduct({ ...product, minSellingPrice: parseFloat(e.target.value) })}
              required
              min="0"
              step="0.01"
            />
            <Input
              type="number"
              placeholder="Initial Stock"
              value={product.stock || ''}
              onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) })}
              required
              min="0"
            />
            <Input
              type="number"
              placeholder="Low Stock Threshold"
              value={product.lowStockThreshold || ''}
              onChange={(e) => setProduct({ ...product, lowStockThreshold: parseInt(e.target.value) })}
              required
              min="0"
            />
            <Input
              placeholder="Barcode"
              value={product.barcode}
              onChange={(e) => setProduct({ ...product, barcode: e.target.value })}
            />
            <Input
              placeholder="Manufacturer"
              value={product.manufacturer}
              onChange={(e) => setProduct({ ...product, manufacturer: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <ImageUpload onImageUploaded={(url) => setProduct({ ...product, imageUrl: url })} />
          </div>
          <Button type="submit" className="w-full">Add Product</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;