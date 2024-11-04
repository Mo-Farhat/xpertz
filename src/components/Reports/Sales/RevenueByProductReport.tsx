import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProductRevenue {
  id: string;
  name: string;
  category: string;
  quantity: number;
  revenue: number;
  averagePrice: number;
  lastSold: Date;
}

const RevenueByProductReport = () => {
  const { tenant } = useTenant();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [revenueData, setRevenueData] = useState<ProductRevenue[]>([]);
  const [sortBy, setSortBy] = useState<'revenue' | 'quantity'>('revenue');

  useEffect(() => {
    const fetchRevenueData = async () => {
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
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
      }

      const salesQuery = query(
        collection(db, `tenants/${tenant.id}/sales`),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(now))
      );

      const snapshot = await getDocs(salesQuery);
      const productRevenueMap = new Map<string, ProductRevenue>();

      snapshot.docs.forEach(doc => {
        const sale = doc.data();
        sale.products.forEach((product: any) => {
          const existing = productRevenueMap.get(product.id) || {
            id: product.id,
            name: product.name,
            category: product.category || 'Uncategorized',
            quantity: 0,
            revenue: 0,
            averagePrice: 0,
            lastSold: sale.date.toDate()
          };

          existing.quantity += product.quantity;
          existing.revenue += product.total;
          existing.averagePrice = existing.revenue / existing.quantity;
          
          if (sale.date.toDate() > existing.lastSold) {
            existing.lastSold = sale.date.toDate();
          }

          productRevenueMap.set(product.id, existing);
        });
      });

      const revenueList = Array.from(productRevenueMap.values());
      setRevenueData(revenueList.sort((a, b) => b[sortBy] - a[sortBy]));
    };

    fetchRevenueData();
  }, [tenant, timeRange, sortBy]);

  const getTopProducts = () => revenueData.slice(0, 5);

  const getCategoryMetrics = () => {
    const categoryMap = revenueData.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = { revenue: 0, quantity: 0 };
      }
      acc[product.category].revenue += product.revenue;
      acc[product.category].quantity += product.quantity;
      return acc;
    }, {} as Record<string, { revenue: number; quantity: number }>);

    return Object.entries(categoryMap)
      .map(([category, data]) => ({
        category,
        ...data
      }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  const totalRevenue = revenueData.reduce((sum, product) => sum + product.revenue, 0);
  const totalQuantity = revenueData.reduce((sum, product) => sum + product.quantity, 0);
  const averageOrderValue = totalQuantity > 0 ? totalRevenue / totalQuantity : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Revenue by Product Report</h3>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="quantity">Quantity Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Units Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalQuantity}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Products by {sortBy === 'revenue' ? 'Revenue' : 'Units Sold'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getTopProducts()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={sortBy} name={sortBy === 'revenue' ? 'Revenue ($)' : 'Units Sold'} fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getCategoryMetrics().map(({ category, revenue, quantity }) => (
              <div key={category} className="flex justify-between items-center border-b pb-2">
                <div>
                  <h4 className="font-medium">{category}</h4>
                  <p className="text-sm text-gray-500">{quantity} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${revenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {((revenue / totalRevenue) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueByProductReport;