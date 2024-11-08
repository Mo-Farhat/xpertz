import React from 'react';
import { Plus } from 'lucide-react';
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { TaxRecord } from './types';

interface TaxFormProps {
  newTaxRecord: Omit<TaxRecord, 'id'>;
  setNewTaxRecord: (record: Omit<TaxRecord, 'id'>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const TaxForm: React.FC<TaxFormProps> = ({ newTaxRecord, setNewTaxRecord, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          placeholder="Tax Year"
          value={newTaxRecord.taxYear}
          onChange={(e) => setNewTaxRecord({ ...newTaxRecord, taxYear: parseInt(e.target.value) })}
        />
        <Input
          type="text"
          placeholder="Tax Type"
          value={newTaxRecord.taxType}
          onChange={(e) => setNewTaxRecord({ ...newTaxRecord, taxType: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Amount"
          value={newTaxRecord.amount}
          onChange={(e) => setNewTaxRecord({ ...newTaxRecord, amount: parseFloat(e.target.value) })}
        />
        <Input
          type="date"
          value={newTaxRecord.dueDate.toISOString().split('T')[0]}
          onChange={(e) => setNewTaxRecord({ ...newTaxRecord, dueDate: new Date(e.target.value) })}
        />
        <Select 
          value={newTaxRecord.status}
          onValueChange={(value: 'pending' | 'paid' | 'overdue') => 
            setNewTaxRecord({ ...newTaxRecord, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Region"
          value={newTaxRecord.region}
          onChange={(e) => setNewTaxRecord({ ...newTaxRecord, region: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} />
        </button>
      </div>
    </form>
  );
};

export default TaxForm;