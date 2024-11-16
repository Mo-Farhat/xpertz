import React, { useState } from 'react';
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { PurchaseOrderItem } from '../types/purchaseOrderTypes';
import { Product } from '../../../../../components/features/Inventory/types';

interface PurchaseOrderItemFormProps {
  onAddItem: (item: PurchaseOrderItem) => void;
  products: Product[];
}

const PurchaseOrderItemForm: React.FC<PurchaseOrderItemFormProps> = ({
  onAddItem,
  products
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [tax, setTax] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    if (!selectedProduct || !quantity || !unitPrice) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const newItem: PurchaseOrderItem = {
      id: Date.now().toString(),
      productId: selectedProduct,
      productName: product.name,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      tax: tax ? Number(tax) : undefined,
      discount: discount ? Number(discount) : undefined,
      totalPrice: Number(quantity) * Number(unitPrice)
    };

    onAddItem(newItem);
    resetForm();
  };

  const resetForm = () => {
    setSelectedProduct('');
    setQuantity('');
    setUnitPrice('');
    setTax('');
    setDiscount('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
        <SelectTrigger>
          <SelectValue placeholder="Select product" />
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              {product.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <Input
        type="number"
        placeholder="Unit Price"
        value={unitPrice}
        onChange={(e) => setUnitPrice(e.target.value)}
      />

      <Input
        type="number"
        placeholder="Tax %"
        value={tax}
        onChange={(e) => setTax(e.target.value)}
      />

      <Input
        type="number"
        placeholder="Discount %"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
      />

      <Button onClick={handleSubmit} type="button" className="w-full">
        Add Item
      </Button>
    </div>
  );
};

export default PurchaseOrderItemForm;