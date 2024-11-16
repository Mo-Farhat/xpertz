import React from 'react';
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Plus } from "lucide-react";
import { LineItemFormProps } from './types';

const LineItemForm: React.FC<LineItemFormProps> = ({
  currentItem,
  onItemChange,
  onAddItem
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Input
        placeholder="Description"
        value={currentItem.description}
        onChange={(e) => onItemChange('description', e.target.value)}
      />
      <Input
        type="number"
        placeholder="Quantity"
        value={currentItem.quantity || ''}
        onChange={(e) => onItemChange('quantity', Number(e.target.value))}
      />
      <Input
        type="number"
        placeholder="Unit Price"
        value={currentItem.unitPrice || ''}
        onChange={(e) => onItemChange('unitPrice', Number(e.target.value))}
      />
      <Button type="button" onClick={onAddItem} className="flex items-center gap-2">
        <Plus className="h-4 w-4" /> Add Item
      </Button>
    </div>
  );
};

export default LineItemForm;