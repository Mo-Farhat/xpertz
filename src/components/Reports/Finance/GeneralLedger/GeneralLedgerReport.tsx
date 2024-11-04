import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useTenant } from '../../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { DateRangePicker } from "../../../../components/ui/date-range-picker";
import { useToast } from "../../../hooks/use-toast";
import { LedgerEntry, CategorySummary } from './types';
import LedgerTable from './LedgerTable';
import CategorySummaryCard from './CategorySummaryCard';
import TotalSummaryCard from './TotalSummaryCard';

const GeneralLedgerReport = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>([]);

  useEffect(() => {
    const fetchLedgerEntries = async () => {
      if (!tenant?.id) return;

      try {
        const q = query(
          collection(db, 'generalLedger'),
          where('date', '>=', Timestamp.fromDate(dateRange.from)),
          where('date', '<=', Timestamp.fromDate(dateRange.to)),
          orderBy('date', 'asc')
        );

        const snapshot = await getDocs(q);
        const ledgerEntries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
        })) as LedgerEntry[];

        setEntries(ledgerEntries);
        calculateSummaries(ledgerEntries);
      } catch (error) {
        console.error('Error fetching ledger entries:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load ledger entries",
        });
      }
    };

    fetchLedgerEntries();
  }, [tenant, dateRange, toast]);

  const calculateSummaries = (ledgerEntries: LedgerEntry[]) => {
    // ... keep existing code (calculateSummaries implementation)
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>General Ledger Report</CardTitle>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <LedgerTable entries={entries} />
          
          {categorySummaries.map((category) => (
            <CategorySummaryCard key={category.category} category={category} />
          ))}

          <TotalSummaryCard categorySummaries={categorySummaries} />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralLedgerReport;