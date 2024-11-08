import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useToast } from "../../../hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { TaxSummary, TaxRecord, ChartDataItem } from './types';

const TaxReports = () => {
  const { toast } = useToast();
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState<TaxSummary>({
    totalTaxLiability: 0,
    paidTaxes: 0,
    pendingTaxes: 0,
    overdueTaxes: 0,
    taxesByType: {},
    taxesByRegion: {},
    upcomingPayments: []
  });

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const taxesRef = collection(db, 'taxRecords');
        const q = query(
          taxesRef,
          where('taxYear', '==', year)
        );
        
        const snapshot = await getDocs(q);
        const records = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          dueDate: doc.data().dueDate.toDate()
        })) as TaxRecord[];

        // Calculate summaries
        const newSummary: TaxSummary = {
          totalTaxLiability: 0,
          paidTaxes: 0,
          pendingTaxes: 0,
          overdueTaxes: 0,
          taxesByType: {},
          taxesByRegion: {},
          upcomingPayments: []
        };

        records.forEach(record => {
          newSummary.totalTaxLiability += record.amount;

          switch (record.status) {
            case 'paid':
              newSummary.paidTaxes += record.amount;
              break;
            case 'pending':
              newSummary.pendingTaxes += record.amount;
              break;
            case 'overdue':
              newSummary.overdueTaxes += record.amount;
              break;
          }

          // Aggregate by tax type
          newSummary.taxesByType[record.taxType] = (newSummary.taxesByType[record.taxType] || 0) + record.amount;

          // Aggregate by region
          newSummary.taxesByRegion[record.region] = (newSummary.taxesByRegion[record.region] || 0) + record.amount;

          // Track upcoming payments
          if (record.status === 'pending') {
            newSummary.upcomingPayments.push({
              type: record.taxType,
              amount: record.amount,
              dueDate: record.dueDate
            });
          }
        });

        // Sort upcoming payments by due date
        newSummary.upcomingPayments.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

        setSummary(newSummary);
      } catch (error) {
        console.error('Error fetching tax data:', error);
        toast({
          title: "Error",
          description: "Failed to load tax report data",
          variant: "destructive",
        });
      }
    };

    fetchTaxData();
  }, [year, toast]);

  const handleExport = () => {
    const reportData = {
      year,
      summary,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tax-report-${year}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData: ChartDataItem[] = Object.entries(summary.taxesByType).map(([type, amount]) => ({
    type,
    amount
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tax Reports</h2>
        <div className="flex gap-4">
          <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => {
                const yearValue = new Date().getFullYear() - 2 + i;
                return (
                  <SelectItem key={yearValue} value={yearValue.toString()}>
                    {yearValue}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tax Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalTaxLiability.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Taxes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${summary.paidTaxes.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Taxes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${summary.pendingTaxes.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Taxes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${summary.overdueTaxes.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tax Distribution by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <BarChart width={800} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#4f46e5" />
            </BarChart>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tax Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary.upcomingPayments.map((payment, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{payment.type}</div>
                  <div className="text-sm text-gray-500">
                    Due: {payment.dueDate.toLocaleDateString()}
                  </div>
                </div>
                <div className="font-bold">${payment.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxReports;