import React from 'react';
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { NewQuotationContract } from './types';

interface FormInputsProps {
  formData: NewQuotationContract;
  setFormData: React.Dispatch<React.SetStateAction<NewQuotationContract>>;
}

export const FormInputs: React.FC<FormInputsProps> = ({ formData, setFormData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select
        value={formData.type}
        onValueChange={(value: 'quotation' | 'contract') => 
          setFormData({ ...formData, type: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="quotation">Quotation</SelectItem>
          <SelectItem value="contract">Contract</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Customer Name"
        value={formData.customerName}
        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
        required
      />

      <Input
        type="email"
        placeholder="Customer Email"
        value={formData.customerEmail}
        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
      />

      <Input
        type="tel"
        placeholder="Customer Phone"
        value={formData.customerPhone}
        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
      />

      <Input
        type="date"
        value={formData.validUntil.toISOString().split('T')[0]}
        onChange={(e) => setFormData({ ...formData, validUntil: new Date(e.target.value) })}
        required
      />

      <Select
        value={formData.priority}
        onValueChange={(value: 'low' | 'medium' | 'high') => 
          setFormData({ ...formData, priority: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};