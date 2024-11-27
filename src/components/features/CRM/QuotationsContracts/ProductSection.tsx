import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Input } from "../../../../components/ui/input";
import { useInventory } from '../../../hooks/useInventory';
import { NewQuotationContract } from './types';
import { Search } from 'lucide-react';

interface ProductSectionProps {
    formData: NewQuotationContract;
    setFormData: React.Dispatch<React.SetStateAction<NewQuotationContract>>;
  }
  
  export const ProductSection: React.FC<ProductSectionProps> = ({ formData, setFormData }) => {
    const { products } = useInventory();
    const [searchTerm, setSearchTerm] = useState('');
  
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleAddItem = (productId: string) => {
      const product = products.find(p => p.id === productId);
      if (!product) return;
  
      const newItem = {
        productId: product.id,
        name: product.name,
        quantity: 1,
        price: product.price,
        subtotal: product.price
      };
  
      const updatedItems = [...formData.items, newItem];
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
  
      setFormData({
        ...formData,
        items: updatedItems,
        amount: totalAmount
      });
    };
  
    const handleUpdateItemQuantity = (index: number, quantity: number) => {
      const updatedItems = formData.items.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            quantity,
            subtotal: quantity * item.price
          };
        }
        return item;
      });
  
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
  
      setFormData({
        ...formData,
        items: updatedItems,
        amount: totalAmount
      });
    };
  
    return (
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold">Products</h3>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
  
        <Select onValueChange={handleAddItem}>
          <SelectTrigger>
            <SelectValue placeholder="Select product to add" />
          </SelectTrigger>
          <SelectContent>
            {filteredProducts.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} - ${product.price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
  
        <div className="space-y-2">
          {formData.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 bg-gray-50 p-2 rounded">
              <span className="flex-1">{item.name}</span>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => handleUpdateItemQuantity(index, parseInt(e.target.value))}
                className="w-24"
                min="1"
              />
              <span className="w-24 text-right">${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
  
        <div className="text-right font-semibold">
          Total: ${formData.amount.toFixed(2)}
        </div>
      </div>
    );
  };