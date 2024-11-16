import React from 'react';
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { ReturnFormData } from './types';

interface ReturnFormProps {
  onSubmit: (data: ReturnFormData) => Promise<void>;
  initialData?: ReturnFormData;
}

const ReturnForm: React.FC<ReturnFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = React.useState<ReturnFormData>(initialData || {
    returnNumber: '',
    poReference: '',
    supplierName: '',
    amount: 0,
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Return Number"
        value={formData.returnNumber}
        onChange={(e) => setFormData({ ...formData, returnNumber: e.target.value })}
        required
      />
      <Input
        placeholder="PO Reference"
        value={formData.poReference}
        onChange={(e) => setFormData({ ...formData, poReference: e.target.value })}
        required
      />
      <Input
        placeholder="Supplier Name"
        value={formData.supplierName}
        onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
        required
      />
      <Input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
        required
      />
      <Input
        placeholder="Reason"
        value={formData.reason}
        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        required
      />
      <Button type="submit">
        {initialData ? 'Update Return' : 'Create Return'}
      </Button>
    </form>
  );
};

export default ReturnForm;