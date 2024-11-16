import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { useToast } from "../../../../hooks/use-toast";
import { DateRangePicker } from "../../../../../components/ui/date-range-picker";
import DayBookTable from './DayBookTable';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../../../firebase';   
import { DayBookEntry } from './types';
import { DateRange } from 'react-day-picker';
import DayBookFilters from './DayBookFilters';
import DayBookSummary from './DayBookSummary';

const DayBook = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<DayBookEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DayBookEntry[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setHours(0, 0, 0, 0)),
    to: new Date(new Date().setHours(23, 59, 59, 999))
  });
  const [transactionType, setTransactionType] = useState('all');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    const loadDayBookEntries = async () => {
      if (!user?.uid || !dateRange.from || !dateRange.to) return;

      try {
        const q = query(
          collection(db, `users/${user.uid}/dayBook`),
          where('date', '>=', Timestamp.fromDate(dateRange.from)),
          where('date', '<=', Timestamp.fromDate(dateRange.to)),
          orderBy('date', 'desc')
        );

        const snapshot = await getDocs(q);
        const dayBookEntries = snapshot.docs.map(doc => ({
          id: doc.id,
          timestamp: doc.data().date.toDate(),
          transactionType: doc.data().moduleType || 'manual',
          reference: doc.data().reference,
          description: doc.data().description,
          debit: doc.data().debit,
          credit: doc.data().credit,
          account: doc.data().accountName,
          status: doc.data().status,
          userId: user.uid
        }));

        setEntries(dayBookEntries);
      } catch (error) {
        console.error('Error fetching day book entries:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load day book entries",
        });
      }
    };

    loadDayBookEntries();
  }, [user, dateRange, toast]);

  useEffect(() => {
    let filtered = [...entries];

    if (transactionType !== 'all') {
      filtered = filtered.filter(entry => entry.transactionType === transactionType);
    }

    if (status !== 'all') {
      filtered = filtered.filter(entry => entry.status === status);
    }

    setFilteredEntries(filtered);
  }, [entries, transactionType, status]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Day Book</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <DayBookFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            transactionType={transactionType}
            onTransactionTypeChange={setTransactionType}
            status={status}
            onStatusChange={setStatus}
          />
          
          <DayBookSummary entries={filteredEntries} />
          <DayBookTable entries={filteredEntries} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DayBook;