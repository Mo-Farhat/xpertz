import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useToast } from "../../../hooks/use-toast";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { ChequeFormData } from './types';

const ChequeForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ChequeFormData>({
    chequeNumber: '',
    amount: 0,
    date: new Date(),
    payeeName: '',
    bankName: '',
    status: 'pending',
    type: 'incoming',
    memo: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'cheques'), {
        ...formData,
        date: Timestamp.fromDate(new Date(formData.date)),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      setFormData({
        chequeNumber: '',
        amount: 0,
        date: new Date(),
        payeeName: '',
        bankName: '',
        status: 'pending',
        type: 'incoming',
        memo: ''
      });

      toast({
        title: "Success",
        description: "Cheque added successfully"
      });
    } catch (error) {
      console.error('Error adding cheque:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add cheque"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Cheque Number"
          value={formData.chequeNumber}
          onChange={(e) => setFormData({ ...formData, chequeNumber: e.target.value })}
          required
        />
        
        <Input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          required
          min="0"
          step="0.01"
        />
        
        <Input
          type="date"
          value={formData.date.toISOString().split('T')[0]}
          onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
          required
        />
        
        <Input
          type="text"
          placeholder="Payee Name"
          value={formData.payeeName}
          onChange={(e) => setFormData({ ...formData, payeeName: e.target.value })}
          required
        />
        
        <Input
          type="text"
          placeholder="Bank Name"
          value={formData.bankName}
          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
          required
        />
        
        <Select
          value={formData.type}
          onValueChange={(value: 'incoming' | 'outgoing') => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="incoming">Incoming</SelectItem>
            <SelectItem value="outgoing">Outgoing</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          type="text"
          placeholder="Memo (Optional)"
          value={formData.memo || ''}
          onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full">Add Cheque</Button>
    </form>
  );
};

export default ChequeForm;