import React, { useState } from 'react';
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { RequisitionItem } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface PurchaseRequisitionFormProps {
    onSubmit: (data: {
      department: string;
      dateRequired: Date;
      items: RequisitionItem[];
    }) => Promise<void>;
  }
  const PurchaseRequisitionForm: React.FC<PurchaseRequisitionFormProps> = ({ onSubmit }) => {
    const [department, setDepartment] = useState('');
    const [dateRequired, setDateRequired] = useState('');
    const [items, setItems] = useState<Omit<RequisitionItem, 'id'>[]>([{
      productName: '',
      quantity: 0,
      estimatedUnitPrice: 0,
      totalPrice: 0,
      specifications: ''
    }]);
    const handleAddItem = () => {
      setItems([...items, {
        productName: '',
        quantity: 0,
        estimatedUnitPrice: 0,
        totalPrice: 0,
        specifications: ''
      }]);
    };
    const handleRemoveItem = (index: number) => {
      setItems(items.filter((_, i) => i !== index));
    };
    const handleItemChange = (index: number, field: keyof Omit<RequisitionItem, 'id'>, value: string | number) => {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        [field]: value,
        totalPrice: field === 'quantity' || field === 'estimatedUnitPrice' 
          ? (field === 'quantity' ? Number(value) : items[index].quantity) * 
            (field === 'estimatedUnitPrice' ? Number(value) : items[index].estimatedUnitPrice)
          : items[index].totalPrice
      };
      setItems(newItems);
    };
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await onSubmit({
        department,
        dateRequired: new Date(dateRequired),
        items: items as RequisitionItem[]
      });
      
      // Reset form
      setDepartment('');
      setDateRequired('');
      setItems([{
        productName: '',
        quantity: 0,
        estimatedUnitPrice: 0,
        totalPrice: 0,
        specifications: ''
      }]);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
          <Input
            type="date"
            value={dateRequired}
            onChange={(e) => setDateRequired(e.target.value)}
            required
          />
        </div>
        <Card>
          <CardContent className="pt-6">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 mb-4">
                <Input
                  placeholder="Product Name"
                  value={item.productName}
                  onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                  required
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                  required
                  min="1"
                />
                <Input
                  type="number"
                  placeholder="Est. Unit Price"
                  value={item.estimatedUnitPrice}
                  onChange={(e) => handleItemChange(index, 'estimatedUnitPrice', Number(e.target.value))}
                  required
                  min="0"
                  step="0.01"
                />
                <Input
                  placeholder="Specifications"
                  value={item.specifications}
                  onChange={(e) => handleItemChange(index, 'specifications', e.target.value)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleAddItem}
              className="w-full mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardContent>
        </Card>
        <Button type="submit" className="w-full">
          Submit Purchase Requisition
        </Button>
      </form>
    );
  };
  export default PurchaseRequisitionForm;