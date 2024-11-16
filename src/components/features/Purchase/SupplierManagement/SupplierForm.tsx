import React, { useState } from 'react';
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Supplier } from '../types';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

interface SupplierFormProps {
  onSubmit: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
  initialData?: Supplier;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Omit<Supplier, 'id'>>(initialData || {
    name: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    paymentTerms: '',
    status: 'active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    if (!initialData) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        taxId: '',
        paymentTerms: '',
        status: 'active'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          placeholder="Supplier Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <Input
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
        <Input
          placeholder="Tax ID"
          value={formData.taxId}
          onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
        />
        <Input
          placeholder="Payment Terms"
          value={formData.paymentTerms}
          onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
        />
        <Select
          value={formData.status}
          onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">
        {initialData ? 'Update Supplier' : 'Add Supplier'}
      </Button>
    </form>
  );
};

export default SupplierForm;