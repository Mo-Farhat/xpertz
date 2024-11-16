import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { useToast } from "../../../hooks/use-toast";
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useAuth } from '../../../../contexts/AuthContext';

interface ManualEntryFormProps {
    onEntryAdded?: () => void;
  }
  
  const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ onEntryAdded }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [entry, setEntry] = useState({
      date: new Date().toISOString().split('T')[0],
      description: '',
      accountNumber: '',
      accountName: '',
      category: '',
      debit: 0,
      credit: 0,
      reference: '',
      moduleType: 'MANUAL',
      status: 'pending' as const
    });
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user?.uid) return;
  
      try {
        const docRef = collection(db, `users/${user.uid}/dayBook`);
        await addDoc(docRef, {
          ...entry,
          date: Timestamp.fromDate(new Date(entry.date)),
          createdAt: Timestamp.fromDate(new Date()),
          moduleId: `MANUAL-${Date.now()}`
        });
  
        toast({
          title: "Success",
          description: "Transaction recorded successfully",
        });
  
        setEntry({
          date: new Date().toISOString().split('T')[0],
          description: '',
          accountNumber: '',
          accountName: '',
          category: '',
          debit: 0,
          credit: 0,
          reference: '',
          moduleType: 'MANUAL',
          status: 'pending'
        });
  
        if (onEntryAdded) {
          onEntryAdded();
        }
      } catch (error) {
        console.error('Error creating manual entry:', error);
        toast({
          title: "Error",
          description: "Failed to record transaction",
          variant: "destructive",
        });
      }
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manual Transaction Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={entry.date}
                  onChange={(e) => setEntry({ ...entry, date: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Account Number</label>
                <Input
                  type="text"
                  value={entry.accountNumber}
                  onChange={(e) => setEntry({ ...entry, accountNumber: e.target.value })}
                  required
                />
              </div>
  
              <div>
                <label className="text-sm font-medium">Account Name</label>
                <Input
                  type="text"
                  value={entry.accountName}
                  onChange={(e) => setEntry({ ...entry, accountName: e.target.value })}
                  required
                />
              </div>
  
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={entry.category}
                  onValueChange={(value) => setEntry({ ...entry, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AP">Accounts Payable</SelectItem>
                    <SelectItem value="AR">Accounts Receivable</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="REVENUE">Revenue</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
  
              <div>
                <label className="text-sm font-medium">Debit Amount</label>
                <Input
                  type="number"
                  value={entry.debit}
                  onChange={(e) => setEntry({ ...entry, debit: Number(e.target.value) })}
                  min={0}
                  step="0.01"
                />
              </div>
  
              <div>
                <label className="text-sm font-medium">Credit Amount</label>
                <Input
                  type="number"
                  value={entry.credit}
                  onChange={(e) => setEntry({ ...entry, credit: Number(e.target.value) })}
                  min={0}
                  step="0.01"
                />
              </div>
  
              <div className="col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  type="text"
                  value={entry.description}
                  onChange={(e) => setEntry({ ...entry, description: e.target.value })}
                  required
                />
              </div>
  
              <div className="col-span-2">
                <label className="text-sm font-medium">Reference</label>
                <Input
                  type="text"
                  value={entry.reference}
                  onChange={(e) => setEntry({ ...entry, reference: e.target.value })}
                />
              </div>
            </div>
  
            <Button type="submit" className="w-full">
              Record Transaction
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };
  
  export default ManualEntryForm;