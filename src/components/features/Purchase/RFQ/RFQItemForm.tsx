import React from 'react';
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { RFQItemFormProps } from '../types';

const RFQItemForm: React.FC<RFQItemFormProps> = ({ item, onItemChange, onAddItem }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Product Name"
          value={item.productName || ''}
          onChange={(e) => onItemChange('productName', e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Quantity"
          value={item.quantity || ''}
          onChange={(e) => onItemChange('quantity', parseInt(e.target.value, 10) || 0)}
          required
          min="1"
        />
        <Input
          type="number"
          placeholder="Estimated Unit Price"
          value={item.estimatedUnitPrice || ''}
          onChange={(e) => onItemChange('estimatedUnitPrice', parseFloat(e.target.value) || 0)}
        />
        <Input
          type="date"
          placeholder="Preferred Delivery Date"
          value={item.preferredDeliveryDate ? new Date(item.preferredDeliveryDate).toISOString().split('T')[0] : ''}
          onChange={(e) => onItemChange('preferredDeliveryDate', new Date(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Technical Requirements"
          value={item.technicalRequirements || ''}
          onChange={(e) => onItemChange('technicalRequirements', e.target.value)}
        />
        <Textarea
          placeholder="Quality Standards"
          value={item.qualityStandards || ''}
          onChange={(e) => onItemChange('qualityStandards', e.target.value)}
        />
        <Textarea
          placeholder="Specifications"
          value={item.specifications || ''}
          onChange={(e) => onItemChange('specifications', e.target.value)}
        />
      </div>
      <Button 
        type="button" 
        onClick={onAddItem}
        className="w-full md:w-auto"
      >
        Add Item
      </Button>
    </div>
  );
};

export default RFQItemForm;