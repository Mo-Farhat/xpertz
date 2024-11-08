import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent } from "../../../components/ui/card";
import { useToast } from "../../hooks/use-toast";
import { LedgerEntry, CategorySummary, LedgerFilters } from './GeneralLedger/types';
import LedgerTable from './GeneralLedger/LedgerTable';
import CategorySummaryCard from './GeneralLedger/CategorySummary';
import LedgerFiltersComponent from './GeneralLedger/LedgerFilters';
import { fetchLedgerEntries } from '../../services/generalLedgerService';
import { Download } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { format } from 'date-fns';

const GeneralLedger = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [filters, setFilters] = useState<LedgerFilters>({
    dateRange: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date()
    }
  });
  const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>([]);

  useEffect(() => {
    const loadLedgerEntries = async () => {
      if (!user?.uid) return;

      try {
        const ledgerEntries = await fetchLedgerEntries(user.uid, filters.dateRange);
        let filteredEntries = ledgerEntries;

        if (filters.modules?.length) {
          filteredEntries = filteredEntries.filter(entry => 
            filters.modules?.includes(entry.module.type)
          );
        }

        if (filters.status?.length) {
          filteredEntries = filteredEntries.filter(entry => 
            filters.status?.includes(entry.status)
          );
        }

        filteredEntries.sort((a, b) => b.date.getTime() - a.date.getTime());
        setEntries(filteredEntries);
        calculateSummaries(filteredEntries);
      } catch (error) {
        console.error('Error fetching ledger entries:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load ledger entries",
        });
      }
    };

    loadLedgerEntries();
  }, [user, filters, toast]);

  const calculateSummaries = (ledgerEntries: LedgerEntry[]) => {
    const summariesMap = new Map<string, CategorySummary>();

    ledgerEntries.forEach(entry => {
      const category = summariesMap.get(entry.category) || {
        category: entry.category,
        totalDebits: 0,
        totalCredits: 0,
        balance: 0,
        accounts: []
      };

      category.totalDebits += entry.debit;
      category.totalCredits += entry.credit;
      category.balance = category.totalDebits - category.totalCredits;

      const accountIndex = category.accounts.findIndex(
        acc => acc.accountNumber === entry.accountNumber
      );

      if (accountIndex === -1) {
        category.accounts.push({
          accountNumber: entry.accountNumber,
          accountName: entry.accountName,
          totalDebits: entry.debit,
          totalCredits: entry.credit,
          balance: entry.debit - entry.credit
        });
      } else {
        const account = category.accounts[accountIndex];
        account.totalDebits += entry.debit;
        account.totalCredits += entry.credit;
        account.balance = account.totalDebits - account.totalCredits;
      }

      summariesMap.set(entry.category, category);
    });

    setCategorySummaries(Array.from(summariesMap.values()));
  };

  const handleExport = () => {
    const csvHeader = 'Date,Account Number,Account Name,Description,Reference,Category,Debit,Credit,Status\n';
    const csvContent = entries.map(entry => 
      `${format(entry.date, 'yyyy-MM-dd')},${entry.accountNumber},"${entry.accountName}","${entry.description}","${entry.reference}",${entry.category},${entry.debit},${entry.credit},${entry.status}`
    ).join('\n');

    const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `general_ledger_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">General Ledger</h2>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <LedgerFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
      />

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <LedgerTable entries={entries} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categorySummaries.map((category) => (
                <CategorySummaryCard key={category.category} category={category} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralLedger;
