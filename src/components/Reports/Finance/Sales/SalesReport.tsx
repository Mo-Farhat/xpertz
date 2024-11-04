import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useTenant } from '../../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { useToast } from "../../../hooks/use-toast";
import { SalesData, SalesSummary } from './types';
import SalesSummaryMetrics from './SalesSummaryMetrics';
import TopPerformers from './TopPerformers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const SalesReport = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [salesData, setSalesData] = useState<SalesSummary>({
    totalSales: 0,
    averageTransaction: 0,
    topProducts: [],
    topCustomers: [],
    salesBySegment: {},
    salesByRegion: {},
    monthlySales: {}
  });

  useEffect(() => {
    const fetchSalesData = async () => {
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

        const salesQuery = query(
          collection(db, `tenants/${tenant.id}/sales`),
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(now))
        );

        const snapshot = await getDocs(salesQuery);
        const sales = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SalesData[];

        // Process sales data
        const summary: SalesSummary = {
          totalSales: sales.reduce((sum, sale) => sum + sale.total, 0),
          averageTransaction: sales.length ? sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length : 0,
          topProducts: [],
          topCustomers: [],
          salesBySegment: {},
          salesByRegion: {},
          monthlySales: {}
        };

        // Process products
        const productMap = new Map();
        sales.forEach(sale => {
          sale.products.forEach(product => {
            const existing = productMap.get(product.id) || { 
              id: product.id, 
              name: product.name,
              totalSales: 0,
              quantity: 0
            };
            existing.totalSales += product.total;
            existing.quantity += product.quantity;
            productMap.set(product.id, existing);
          });
        });
        summary.topProducts = Array.from(productMap.values())
          .sort((a, b) => b.totalSales - a.totalSales);

        // Process customers
        const customerMap = new Map();
        sales.forEach(sale => {
          const existing = customerMap.get(sale.customerId) || {
            id: sale.customerId,
            name: sale.customerName,
            totalPurchases: 0,
            totalAmount: 0
          };
          existing.totalPurchases++;
          existing.totalAmount += sale.total;
          customerMap.set(sale.customerId, existing);
        });
        summary.topCustomers = Array.from(customerMap.values())
          .sort((a, b) => b.totalAmount - a.totalAmount);

        setSalesData(summary);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        toast({
          title: "Error",
          description: "Failed to load sales data",
          variant: "destructive",
        });
      }
    };

    fetchSalesData();
  }, [tenant, timeRange, toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Sales Report</h3>
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

      <SalesSummaryMetrics data={salesData} />
      <TopPerformers data={salesData} />

      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(salesData.monthlySales).map(([month, amount]) => ({
                month,
                amount
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReport;