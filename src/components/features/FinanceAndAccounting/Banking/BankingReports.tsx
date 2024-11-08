import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { BankTransaction, BankingMetrics } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "../../../hooks/use-toast";

const BankingReports = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<BankingMetrics>({
    totalCredits: 0,
    totalDebits: 0,
    netBalance: 0,
    reconciledCount: 0,
    unreconciledCount: 0,
    reconciledPercentage: 0
  });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    const fetchBankingData = async () => {
      try {
        const q = query(collection(db, 'bankTransactions'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const transactions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        })) as BankTransaction[];

        // Calculate metrics
        const calculatedMetrics = transactions.reduce((acc, transaction) => {
          if (transaction.type === 'credit') {
            acc.totalCredits += transaction.amount;
          } else {
            acc.totalDebits += transaction.amount;
          }
          
          if (transaction.reconciled) {
            acc.reconciledCount++;
          } else {
            acc.unreconciledCount++;
          }
          
          return acc;
        }, {
          totalCredits: 0,
          totalDebits: 0,
          reconciledCount: 0,
          unreconciledCount: 0
        });

        const totalTransactions = calculatedMetrics.reconciledCount + calculatedMetrics.unreconciledCount;
        
        setMetrics({
          ...calculatedMetrics,
          netBalance: calculatedMetrics.totalCredits - calculatedMetrics.totalDebits,
          reconciledPercentage: totalTransactions > 0 
            ? (calculatedMetrics.reconciledCount / totalTransactions) * 100 
            : 0
        });

        // Calculate monthly data
        const monthlyTransactions = transactions.reduce((acc, transaction) => {
          const monthYear = transaction.date.toLocaleString('default', { month: 'long', year: 'numeric' });
          if (!acc[monthYear]) {
            acc[monthYear] = { credits: 0, debits: 0 };
          }
          if (transaction.type === 'credit') {
            acc[monthYear].credits += transaction.amount;
          } else {
            acc[monthYear].debits += transaction.amount;
          }
          return acc;
        }, {} as Record<string, { credits: number; debits: number; }>);

        setMonthlyData(Object.entries(monthlyTransactions).map(([month, data]) => ({
          month,
          ...data
        })));

      } catch (error) {
        console.error('Error fetching banking data:', error);
        toast({
          title: "Error",
          description: "Failed to load banking reports data",
          variant: "destructive",
        });
      }
    };

    fetchBankingData();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${metrics.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${metrics.netBalance.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Credits: ${metrics.totalCredits.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Debits: ${metrics.totalDebits.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reconciliation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.reconciledPercentage.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">
              {metrics.reconciledCount} of {metrics.reconciledCount + metrics.unreconciledCount} reconciled
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Transaction Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="credits" name="Credits" fill="#22c55e" />
                <Bar dataKey="debits" name="Debits" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankingReports;