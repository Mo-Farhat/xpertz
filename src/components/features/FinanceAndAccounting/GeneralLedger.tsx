import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { useToast } from "../../hooks/use-toast";
import { format } from 'date-fns';
interface LedgerEntry {
  id: string;
  date: Date;
  description: string;
  debit: number;
  credit: number;
  account: string;
}
const GeneralLedger: React.FC = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [newEntry, setNewEntry] = useState<Omit<LedgerEntry, 'id'>>({
    date: new Date(),
    description: '',
    debit: 0,
    credit: 0,
    account: '',
  });
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const q = query(collection(db, 'generalLedger'), orderBy('date', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ledgerEntries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      } as LedgerEntry));
      setEntries(ledgerEntries);
    }, (err) => {
      console.error("Error fetching general ledger entries:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load general ledger entries. Please try again later.",
      });
    });
    return unsubscribe;
  }, [toast]);
  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'generalLedger'), {
        ...newEntry,
        date: new Date(newEntry.date),
        debit: Number(newEntry.debit) || 0,
        credit: Number(newEntry.credit) || 0,
      });
      setNewEntry({
        date: new Date(),
        description: '',
        debit: 0,
        credit: 0,
        account: '',
      });
      toast({
        title: "Success",
        description: "Entry added successfully",
      });
    } catch (error) {
      console.error("Error adding entry: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add entry. Please try again.",
      });
    }
  };
  const handleExport = () => {
    const csvContent = [
      ['Date', 'Account', 'Description', 'Debit', 'Credit'].join(','),
      ...entries.map(entry => [
        format(entry.date, 'yyyy-MM-dd'),
        entry.account,
        entry.description,
        entry.debit,
        entry.credit
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `general_ledger_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>General Ledger</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddEntry} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Input
            type="date"
            value={format(newEntry.date, 'yyyy-MM-dd')}
            onChange={(e) => setNewEntry({ ...newEntry, date: new Date(e.target.value) })}
            required
          />
          <Input
            type="text"
            placeholder="Account"
            value={newEntry.account}
            onChange={(e) => setNewEntry({ ...newEntry, account: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Description"
            value={newEntry.description}
            onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
            required
          />
          <Input
            type="number"
            placeholder="Debit"
            value={newEntry.debit || ''}
            onChange={(e) => setNewEntry({ ...newEntry, debit: parseFloat(e.target.value) })}
            step="0.01"
          />
          <Input
            type="number"
            placeholder="Credit"
            value={newEntry.credit || ''}
            onChange={(e) => setNewEntry({ ...newEntry, credit: parseFloat(e.target.value) })}
            step="0.01"
          />
          <Button type="submit" className="md:col-span-5 flex items-center gap-2">
            <Plus size={16} />
            Add Entry
          </Button>
        </form>
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <Download size={16} />
            Export CSV
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(entry.date, 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{entry.account}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell className="text-right">{entry.debit.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{entry.credit.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
export default GeneralLedger;