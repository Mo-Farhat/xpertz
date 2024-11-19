import React from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Plus } from 'lucide-react';
import { InventoryItem } from './types';

interface InventoryFormProps {
  item: Omit<InventoryItem, 'id' | 'status'>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof Omit<InventoryItem, 'id' | 'status'>, value: any) => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ item, onSubmit, onChange }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Item Name"
          value={item.name}
          onChange={(e) => onChange('name', e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="SKU"
          value={item.sku}
          onChange={(e) => onChange('sku', e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Quantity"
          value={item.quantity}
          onChange={(e) => onChange('quantity', parseInt(e.target.value))}
          required
          min="0"
        />
        <Input
          type="number"
          placeholder="Reorder Point"
          value={item.reorderPoint}
          onChange={(e) => onChange('reorderPoint', parseInt(e.target.value))}
          required
          min="0"
        />
        <Input
          type="number"
          placeholder="Unit Cost"
          value={item.unitCost}
          onChange={(e) => onChange('unitCost', parseFloat(e.target.value))}
          required
          min="0"
          step="0.01"
        />
        <Input
          type="text"
          placeholder="Location"
          value={item.location}
          onChange={(e) => onChange('location', e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Supplier"
          value={item.supplier || ''}
          onChange={(e) => onChange('supplier', e.target.value)}
        />
        <Input
          type="number"
          placeholder="Minimum Order Quantity"
          value={item.minimumOrderQuantity || ''}
          onChange={(e) => onChange('minimumOrderQuantity', parseInt(e.target.value))}
          min="0"
        />
        <Select 
          value={item.category} 
          onValueChange={(value) => onChange('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="raw-materials">Raw Materials</SelectItem>
            <SelectItem value="finished-goods">Finished Goods</SelectItem>
            <SelectItem value="packaging">Packaging</SelectItem>
            <SelectItem value="supplies">Supplies</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Item
      </Button>
    </form>
  );
};

export default InventoryForm;