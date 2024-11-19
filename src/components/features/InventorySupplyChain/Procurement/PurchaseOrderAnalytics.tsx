import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PurchaseOrderData {
  date: Date;
  orderCount: number;
  totalAmount: number;
}

export const PurchaseOrderAnalytics = () => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [analytics, setAnalytics] = useState<PurchaseOrderData[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
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

      const ordersQuery = query(
        collection(db, 'purchaseOrders'),
        where('orderDate', '>=', Timestamp.fromDate(startDate))
      );

      const snapshot = await getDocs(ordersQuery);
      const orders = snapshot.docs.map(doc => ({
        ...doc.data(),
        date: doc.data().orderDate.toDate()
      }));

      // Group by date for trend analysis
      const groupedData = orders.reduce((acc: Record<string, PurchaseOrderData>, order) => {
        const date = order.date.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = {
            date: new Date(date),
            orderCount: 0,
            totalAmount: 0
          };
        }
        acc[date].orderCount++;
        acc[date].totalAmount += order.totalAmount || 0;
        return acc;
      }, {});

      setAnalytics(Object.values(groupedData));
    };

    fetchAnalytics();
  }, [timeRange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Purchase Order Analytics</h3>
        <Select value={timeRange} onValueChange={(value: 'month' | 'quarter' | 'year') => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Order Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    formatter={(value) => typeof value === 'number' ? value.toFixed(2) : value}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="orderCount" 
                    stroke="#4f46e5" 
                    name="Order Count"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="totalAmount" 
                    stroke="#10b981" 
                    name="Total Amount"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseOrderAnalytics;