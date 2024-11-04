import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesData {
  id: string;
  salesperson: string;
  region: string;
  product: string;
  amount: number;
  quantity: number;
  date: Date;
}

const SalesPerformanceReport = () => {
  const { tenant } = useTenant();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [groupBy, setGroupBy] = useState<'product' | 'region' | 'salesperson'>('product');
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!tenant) return;

      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
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
        ...doc.data(),
        date: doc.data().date.toDate()
      })) as SalesData[];

      setSalesData(sales);
    };

    fetchSalesData();
  }, [tenant, timeRange]);

  const getGroupedData = () => {
    const grouped = salesData.reduce((acc, sale) => {
      const key = sale[groupBy];
      if (!acc[key]) {
        acc[key] = {
          name: key,
          totalSales: 0,
          totalQuantity: 0
        };
      }
      acc[key].totalSales += sale.amount;
      acc[key].totalQuantity += sale.quantity;
      return acc;
    }, {} as Record<string, { name: string; totalSales: number; totalQuantity: number }>);

    return Object.values(grouped);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sales Performance Report</h3>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">By Product</SelectItem>
              <SelectItem value="region">By Region</SelectItem>
              <SelectItem value="salesperson">By Salesperson</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${salesData.reduce((sum, sale) => sum + sale.amount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Units Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {salesData.reduce((sum, sale) => sum + sale.quantity, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${salesData.length ? (salesData.reduce((sum, sale) => sum + sale.amount, 0) / salesData.length).toFixed(2) : '0.00'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Performance Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getGroupedData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSales" name="Total Sales ($)" fill="#3B82F6" />
                <Bar dataKey="totalQuantity" name="Units Sold" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPerformanceReport;