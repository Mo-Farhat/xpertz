import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { ReturnRefund } from './types';

interface ReturnFormProps {
  returnRefund: Omit<ReturnRefund, 'id' | 'createdAt'>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (value: Omit<ReturnRefund, 'id' | 'createdAt'>) => void;
}

const ReturnForm: React.FC<ReturnFormProps> = ({ returnRefund, onSubmit, onChange }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>New Return/Refund Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Order ID"
              value={returnRefund.orderId}
              onChange={(e) => onChange({ ...returnRefund, orderId: e.target.value })}
              required
            />
            <Input
              placeholder="Customer Name"
              value={returnRefund.customerName}
              onChange={(e) => onChange({ ...returnRefund, customerName: e.target.value })}
              required
            />
            <Textarea
              placeholder="Reason"
              value={returnRefund.reason}
              onChange={(e) => onChange({ ...returnRefund, reason: e.target.value })}
              required
            />
            <Select 
              value={returnRefund.status}
              onValueChange={(value) => onChange({ ...returnRefund, status: value as ReturnRefund['status'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Amount"
              value={returnRefund.amount}
              onChange={(e) => onChange({ ...returnRefund, amount: parseFloat(e.target.value) })}
              required
              min="0"
              step="0.01"
            />
            <Input
              type="date"
              value={returnRefund.requestDate.toISOString().split('T')[0]}
              onChange={(e) => onChange({ ...returnRefund, requestDate: new Date(e.target.value) })}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Return/Refund
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReturnForm;