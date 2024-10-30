import React, { useState, useRef } from 'react';
import { Plus, Upload } from 'lucide-react';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card } from "../../ui/card";
import { Label } from "../../ui/label";
import { Product } from './types';

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id'> & { imageFile?: File }) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: 0,
    price: 0,
    stock: 0,
    lowStockThreshold: 10,
    imageUrl: '',
    imageFile: undefined as File | undefined,
    barcode: '',
    manufacturer: ''
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newProduct);
    setNewProduct({
      name: '',
      quantity: 0,
      price: 0,
      stock: 0,
      lowStockThreshold: 10,
      imageUrl: '',
      imageFile: undefined,
      barcode: '',
      manufacturer: ''
    });
    setPreviewUrl(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              type="text"
              value={newProduct.barcode}
              onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              type="text"
              value={newProduct.manufacturer}
              onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
            <Input
              id="lowStockThreshold"
              type="number"
              value={newProduct.lowStockThreshold}
              onChange={(e) => setNewProduct({ ...newProduct, lowStockThreshold: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Product Image</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-auto max-h-32 object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full mt-4">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </Card>
    </form>
  );
};

export default ProductForm;