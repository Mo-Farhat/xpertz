import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { useToast } from "../../hooks/use-toast";

interface SalesData {
  date: string;
  totalSales: number;
}

interface ProductSalesData {
  name: string;
  sales: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportingAnalytics: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productSalesData, setProductSalesData] = useState<ProductSalesData[]>([]);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');
  const { toast } = useToast();

  useEffect(() => {
    fetchSalesData();
    fetchProductSalesData();
  }, [dateRange]);

  const fetchSalesData = async () => {
    const salesCollection = collection(db, 'sales');
    const endDate = new Date();
    const startDate = new Date();

    switch (dateRange) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    try {
      const q = query(
        salesCollection,
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );

      const querySnapshot = await getDocs(q);
      const sales: { [date: string]: number } = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = new Date(data.date.seconds * 1000).toLocaleDateString();
        sales[date] = (sales[date] || 0) + data.total;
      });

      const salesData = Object.entries(sales).map(([date, totalSales]) => ({
        date,
        totalSales,
      }));

      setSalesData(salesData.sort((a, b) => a.date.localeCompare(b.date)));
    } catch (error) {
      console.error("Error fetching sales data: ", error);
      toast({
        title: "Error",
        description: "Failed to fetch sales data",
        variant: "destructive",
      });
    }
  };

  const fetchProductSalesData = async () => {
    try {
      const salesCollection = collection(db, 'sales');
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      const q = query(
        salesCollection,
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );

      const querySnapshot = await getDocs(q);
      const productSales: { [productId: string]: { name: string; sales: number } } = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.items.forEach((item: any) => {
          if (!productSales[item.id]) {
            productSales[item.id] = { name: item.name, sales: 0 };
          }
          productSales[item.id].sales += item.quantity;
        });
      });

      const productSalesData = Object.values(productSales)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      setProductSalesData(productSalesData);
    } catch (error) {
      console.error("Error fetching product sales data: ", error);
      toast({
        title: "Error",
        description: "Failed to fetch product sales data",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csvContent = "Date,Total Sales\n" + 
      salesData.map(data => `${data.date},${data.totalSales}`).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "Sales report exported successfully",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Sales Analytics</h3>
        <div className="flex gap-4">
          <Select value={dateRange} onValueChange={(value: 'week' | 'month' | 'year') => setDateRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalSales" fill="#8884d8" name="Total Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Products (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productSalesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="sales"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {productSalesData.map((entry, index) => (
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
      </div>
    </div>
  );
};

export default ReportingAnalytics;