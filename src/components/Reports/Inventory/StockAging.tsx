import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useToast } from '../../hooks/use-toast';
import { differenceInDays } from 'date-fns';

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  lastRestockDate: Date;
  value: number;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const StockAging = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'inventory')));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          quantity: doc.data().quantity,
          lastRestockDate: doc.data().lastRestockDate?.toDate() || new Date(),
          value: doc.data().price * doc.data().quantity
        }));
        setStockItems(items);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch stock aging data",
          variant: "destructive",
        });
      }
    };

    fetchStock();
  }, [toast]);

  const getAgingCategory = (days: number) => {
    if (days <= 30) return '0-30 days';
    if (days <= 60) return '31-60 days';
    if (days <= 90) return '61-90 days';
    return '90+ days';
  };

  const agingData = stockItems.reduce((acc, item) => {
    const age = differenceInDays(new Date(), item.lastRestockDate);
    const category = getAgingCategory(age);
    
    if (!acc[category]) {
      acc[category] = { value: 0, items: 0 };
    }
    
    acc[category].value += item.value;
    acc[category].items += item.quantity;
    return acc;
  }, {} as Record<string, { value: number; items: number; }>);

  const chartData = Object.entries(agingData).map(([name, data]) => ({
    name,
    value: data.value
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Stock Aging Analysis</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aging Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aging Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Age Range</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(agingData).map(([category, data]) => (
                  <TableRow key={category}>
                    <TableCell>{category}</TableCell>
                    <TableCell className="text-right">{data.items}</TableCell>
                    <TableCell className="text-right">${data.value.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Aging Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Days in Stock</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Age Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockItems.map((item) => {
                const age = differenceInDays(new Date(), item.lastRestockDate);
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{age}</TableCell>
                    <TableCell className="text-right">${item.value.toFixed(2)}</TableCell>
                    <TableCell>{getAgingCategory(age)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockAging;