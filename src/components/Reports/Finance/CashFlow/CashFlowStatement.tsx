import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useTenant } from '../../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { CashFlowData } from './types';
import CashFlowSummary from './CashFlowSummary';
import { useToast } from "../../../hooks/use-toast";

const CashFlowStatement = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [cashFlowData, setCashFlowData] = useState<CashFlowData>({
    operating: {
      revenue: 0,
      expenses: 0,
      accountsReceivable: 0,
      accountsPayable: 0,
      inventory: 0,
      otherOperating: 0
    },
    investing: {
      assetPurchases: 0,
      assetSales: 0,
      investments: 0,
      otherInvesting: 0
    },
    financing: {
      debtPayments: 0,
      debtProceeds: 0,
      equity: 0,
      dividends: 0,
      otherFinancing: 0
    },
    period: new Date().toISOString()
  });

  useEffect(() => {
    const fetchCashFlowData = async () => {
      if (!tenant) return;

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

        const cashFlowQuery = query(
          collection(db, `tenants/${tenant.id}/cashFlow`),
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(now))
        );

        const snapshot = await getDocs(cashFlowQuery);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as CashFlowData;
          setCashFlowData(data);
        }
      } catch (error) {
        console.error('Error fetching cash flow data:', error);
        toast({
          title: "Error",
          description: "Failed to load cash flow data",
          variant: "destructive",
        });
      }
    };

    fetchCashFlowData();
  }, [tenant, timeRange, toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Cash Flow Statement</h3>
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

      <CashFlowSummary data={cashFlowData} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Operating Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Revenue</span>
              <span className="font-semibold">${cashFlowData.operating.revenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Expenses</span>
              <span className="font-semibold text-red-600">-${Math.abs(cashFlowData.operating.expenses).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Changes in Working Capital</span>
              <span className="font-semibold">${(
                cashFlowData.operating.accountsPayable -
                cashFlowData.operating.accountsReceivable -
                cashFlowData.operating.inventory
              ).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investing Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Asset Sales</span>
              <span className="font-semibold">${cashFlowData.investing.assetSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Asset Purchases</span>
              <span className="font-semibold text-red-600">-${Math.abs(cashFlowData.investing.assetPurchases).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Investments</span>
              <span className="font-semibold">${cashFlowData.investing.investments.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financing Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Debt Proceeds</span>
              <span className="font-semibold">${cashFlowData.financing.debtProceeds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Debt Payments</span>
              <span className="font-semibold text-red-600">-${Math.abs(cashFlowData.financing.debtPayments).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Equity</span>
              <span className="font-semibold">${cashFlowData.financing.equity.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Dividends</span>
              <span className="font-semibold text-red-600">-${Math.abs(cashFlowData.financing.dividends).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CashFlowStatement;