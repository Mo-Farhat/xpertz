import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { DayBookEntry } from './types';

interface DayBookSummaryProps {
  entries: DayBookEntry[];
}

const DayBookSummary: React.FC<DayBookSummaryProps> = ({ entries }) => {
  const totalDebits = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredits = entries.reduce((sum, entry) => sum + entry.credit, 0);
  const balance = totalCredits - totalDebits;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Debits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalDebits.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalCredits.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${balance.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DayBookSummary;