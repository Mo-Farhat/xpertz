import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';

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

    const q = query(
      salesCollection,
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );

    try {
      const querySnapshot = await getDocs(q);
      const sales: { [date: string]: number } = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = new Date(data.date.seconds * 1000).toISOString().split('T')[0];
        sales[date] = (sales[date] || 0) + data.total;
      });

      const salesData = Object.entries(sales).map(([date, totalSales]) => ({
        date,
        totalSales,
      }));

      setSalesData(salesData.sort((a, b) => a.date.localeCompare(b.date)));
    } catch (error) {
      console.error("Error fetching sales data: ", error);
    }
  };

  const fetchProductSalesData = async () => {
    const salesCollection = collection(db, 'sales');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30); // Last 30 days

    const q = query(
      salesCollection,
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );

    try {
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
    }
  };

  const handleExport = () => {
    const csvContent = salesData.map(data => 
      `${data.date},${data.totalSales}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'sales_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Reporting & Analytics</h3>
      <div className="mb-4">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as 'week' | 'month' | 'year')}
          className="p-2 border rounded mr-2"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <Download size={18} className="inline mr-2" />
          Export CSV
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-semibold mb-2">Sales Trend</h4>
          <ResponsiveContainer width="100%" height={300}>
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
        <div>
          <h4 className="text-lg font-semibold mb-2">Top 5 Products (Last 30 Days)</h4>
          <ResponsiveContainer width="100%" height={300}>
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
      </div>
    </div>
  );
};

export default ReportingAnalytics;