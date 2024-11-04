import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useTenant } from '../../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import RetentionMetrics from './RetentionMetrics';
import RetentionChart from './RetentionChart';
import ChurnTable from './ChurnTable';

const CustomerRetentionReport = () => {
  const { tenant } = useTenant();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [retentionData, setRetentionData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRetentionData = async () => {
      if (!tenant) return;
      setIsLoading(true);

      try {
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
          case 'month':
            startDate.setMonth(now.getMonth() - 12);
            break;
          case 'quarter':
            startDate.setMonth(now.getMonth() - 24);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 3);
            break;
        }

        const customersQuery = query(
          collection(db, `tenants/${tenant.id}/customers`),
          where('createdAt', '>=', Timestamp.fromDate(startDate)),
          where('createdAt', '<=', Timestamp.fromDate(now)),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(customersQuery);
        const customers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
        }));

        const retentionAnalysis = calculateRetentionMetrics(customers, timeRange);
        setRetentionData(retentionAnalysis);
      } catch (error) {
        console.error('Error fetching retention data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRetentionData();
  }, [tenant, timeRange]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Customer Retention Analysis</h3>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Monthly Analysis</SelectItem>
            <SelectItem value="quarter">Quarterly Analysis</SelectItem>
            <SelectItem value="year">Yearly Analysis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <RetentionMetrics data={retentionData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Retention Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <RetentionChart data={retentionData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Churn Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ChurnTable data={retentionData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const calculateRetentionMetrics = (customers: any[], timeRange: string) => {
  // Group customers by period
  const periods = groupCustomersByPeriod(customers, timeRange);
  
  // Calculate retention and churn rates
  return Object.entries(periods).map(([period, data]) => {
    const totalCustomers = data.total;
    const activeCustomers = data.active;
    const churnedCustomers = data.churned;
    
    const retentionRate = totalCustomers ? (activeCustomers / totalCustomers) * 100 : 0;
    const churnRate = totalCustomers ? (churnedCustomers / totalCustomers) * 100 : 0;
    
    return {
      period,
      totalCustomers,
      activeCustomers,
      churnedCustomers,
      retentionRate,
      churnRate
    };
  });
};

const groupCustomersByPeriod = (customers: any[], timeRange: string) => {
  const periods: Record<string, { total: number; active: number; churned: number }> = {};
  
  customers.forEach(customer => {
    const period = formatPeriod(customer.createdAt, timeRange);
    if (!periods[period]) {
      periods[period] = { total: 0, active: 0, churned: 0 };
    }
    
    periods[period].total++;
    if (customer.status === 'active') {
      periods[period].active++;
    } else {
      periods[period].churned++;
    }
  });
  
  return periods;
};

const formatPeriod = (date: Date, timeRange: string): string => {
  switch (timeRange) {
    case 'month':
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    case 'quarter':
      return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
    case 'year':
      return date.getFullYear().toString();
    default:
      return '';
  }
};

export default CustomerRetentionReport;