import React from 'react';
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { CustomerFormData, CustomerType } from './types';
import { Plus, Save } from 'lucide-react';

interface CustomerFormProps {
  customer: CustomerFormData;
  onCustomerChange: (customer: CustomerFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onCustomerChange,
  onSubmit,
  isEditing = false
}) => {
  const customerTypes: { value: CustomerType; label: string }[] = [
    { value: 'regular', label: 'Regular' },
    { value: 'debt', label: 'Debt' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'installment', label: 'Installment' },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="Name"
          value={customer.name}
          onChange={(e) => onCustomerChange({ ...customer, name: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={customer.email}
          onChange={(e) => onCustomerChange({ ...customer, email: e.target.value })}
          required
        />
        <Input
          type="tel"
          placeholder="Phone"
          value={customer.phone}
          onChange={(e) => onCustomerChange({ ...customer, phone: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Company"
          value={customer.company}
          onChange={(e) => onCustomerChange({ ...customer, company: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Address"
          value={customer.address}
          onChange={(e) => onCustomerChange({ ...customer, address: e.target.value })}
        />
        <Select
          value={customer.type}
          onValueChange={(value: CustomerType) => onCustomerChange({ ...customer, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select customer type" />
          </SelectTrigger>
          <SelectContent>
            {customerTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full md:w-auto">
        {isEditing ? (
          <>
            <Save className="mr-2 h-4 w-4" /> Update Customer
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </>
        )}
      </Button>
    </form>
  );
};

export default CustomerForm;