import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download } from 'lucide-react';

interface LedgerEntry {
  id: string;
  date: Date;
  description: string;
  debit: number;
  credit: number;
  account: string;
}

const GeneralLedger: React.FC = () => {
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
      setError("Failed to load general ledger entries. Please try again later.");
    });
    return unsubscribe;
  }, []);

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
      setError(null);
    } catch (error) {
      console.error("Error adding entry: ", error);
      setError("Failed to add entry. Please try again.");
    }
  };

  const handleExport = () => {
    // ... (export logic remains the same)
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">General Ledger</h2>
      <form onSubmit={handleAddEntry} className="mb-4">
        {/* ... (form fields remain the same) */}
      </form>
      <button
        onClick={handleExport}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
      >
        <Download size={18} className="mr-2" />
        Export CSV
      </button>
      <table className="w-full bg-white shadow-md rounded">
        {/* ... (table structure remains the same) */}
      </table>
    </div>
  );
};

export default GeneralLedger;