import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useTenant } from '../../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import CustomerPurchaseMetrics from './CustomerPurchaseMetrics';
import CustomerPurchaseTable from './CustomerPurchaseTable';
import CustomerPurchaseChart from './CustomerPurchaseChart';

interface CustomerPurchase {
  customerId: string;
  customerName: string;
  date: Date;
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

const CustomerPurchaseHistoryReport = () => {
  const { tenant } = useTenant();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [purchaseData, setPurchaseData] = useState<CustomerPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseData = async () => {
      if (!tenant) return;
      setIsLoading(true);

      try {
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
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

        const salesQuery = query(
          collection(db, `tenants/${tenant.id}/sales`),
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(now)),
          orderBy('date', 'desc')
        );

        const snapshot = await getDocs(salesQuery);
        const purchases = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            customerId: data.customerId,
            customerName: data.customerName,
            date: data.date.toDate(),
            total: data.total,
            items: data.items
          };
        });

        setPurchaseData(purchases);
      } catch (error) {
        console.error('Error fetching purchase data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseData();
  }, [tenant, timeRange]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Customer Purchase History Report</h3>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CustomerPurchaseMetrics data={purchaseData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerPurchaseChart data={purchaseData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerPurchaseTable data={purchaseData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerPurchaseHistoryReport;