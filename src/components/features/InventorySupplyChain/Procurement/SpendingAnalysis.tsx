import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface SpendingData {
  name: string;
  value: number;
}

const SpendingAnalysis = () => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [spendingData, setSpendingData] = useState<SpendingData[]>([]);

  useEffect(() => {
    const fetchSpendingData = async () => {
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
      const categorySpending = snapshot.docs.reduce((acc: Record<string, number>, doc) => {
        const order = doc.data();
        const category = order.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += order.totalAmount || 0;
        return acc;
      }, {});

      setSpendingData(
        Object.entries(categorySpending).map(([name, value]) => ({
          name,
          value
        }))
      );
    };

    fetchSpendingData();
  }, [timeRange]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-semibold">{data.name}</p>
          <p>Amount: ${Number(data.value).toFixed(2)}</p>
          <p>Percentage: {((data.value / spendingData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Spending Analysis</h3>
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

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {spendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpendingAnalysis;