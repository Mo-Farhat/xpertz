import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useTenant } from '../../../../contexts/TenantContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { useToast } from "../../../hooks/use-toast";
import { AgingData } from './types';
import AgingSummaryMetrics from './AgingSummaryMetrics';
import AgingTable from './AgingTable';

const AgingReport = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [agingData, setAgingData] = useState<AgingData>({
    receivables: { total: 0, brackets: {}, accounts: [] },
    payables: { total: 0, brackets: {}, accounts: [] }
  });

  useEffect(() => {
    const fetchAgingData = async () => {
      if (!tenant?.id) return;

      try {
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'quarter':
            startDate.setMonth(now.getMonth() - 3);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }

        const [receivablesSnapshot, payablesSnapshot] = await Promise.all([
          getDocs(query(
            collection(db, `tenants/${tenant.id}/receivables`),
            where('date', '>=', Timestamp.fromDate(startDate))
          )),
          getDocs(query(
            collection(db, `tenants/${tenant.id}/payables`),
            where('date', '>=', Timestamp.fromDate(startDate))
          ))
        ]);

        // Process the data and update state
        const processedData: AgingData = {
          receivables: {
            total: receivablesSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0),
            brackets: {},
            accounts: receivablesSnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.customerName,
                total: data.amount,
                brackets: calculateAgingBrackets(data.dueDate.toDate(), data.amount),
                lastPaymentDate: data.lastPaymentDate?.toDate() || new Date(),
                status: isOverdue(data.dueDate.toDate()) ? 'overdue' : 'current'
              };
            })
          },
          payables: {
            total: payablesSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0),
            brackets: {},
            accounts: payablesSnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.vendorName,
                total: data.amount,
                brackets: calculateAgingBrackets(data.dueDate.toDate(), data.amount),
                lastPaymentDate: data.lastPaymentDate?.toDate() || new Date(),
                status: isOverdue(data.dueDate.toDate()) ? 'overdue' : 'current'
              };
            })
          }
        };

        setAgingData(processedData);
      } catch (error) {
        console.error('Error fetching aging data:', error);
        toast({
          title: "Error",
          description: "Failed to load aging report data",
          variant: "destructive",
        });
      }
    };

    fetchAgingData();
  }, [tenant, timeRange, toast]);

  const calculateAgingBrackets = (dueDate: Date, amount: number) => {
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const brackets = [
      { range: '0-30', amount: 0, percentage: 0 },
      { range: '31-60', amount: 0, percentage: 0 },
      { range: '61-90', amount: 0, percentage: 0 },
      { range: '90+', amount: 0, percentage: 0 }
    ];

    if (daysDiff <= 30) brackets[0].amount = amount;
    else if (daysDiff <= 60) brackets[1].amount = amount;
    else if (daysDiff <= 90) brackets[2].amount = amount;
    else brackets[3].amount = amount;

    brackets.forEach(bracket => {
      bracket.percentage = (bracket.amount / amount) * 100;
    });

    return brackets;
  };

  const isOverdue = (dueDate: Date) => {
    return dueDate < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Aging Report</h3>
        <Select value={timeRange} onValueChange={(value: 'month' | 'quarter' | 'year') => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="quarter">Quarterly</SelectItem>
            <SelectItem value="year">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AgingSummaryMetrics data={agingData} />

      <div className="space-y-6">
        <AgingTable title="Accounts Receivable" accounts={agingData.receivables.accounts} />
        <AgingTable title="Accounts Payable" accounts={agingData.payables.accounts} />
      </div>
    </div>
  );
};

export default AgingReport;