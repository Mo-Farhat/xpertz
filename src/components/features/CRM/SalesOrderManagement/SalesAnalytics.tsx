import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Download } from 'lucide-react';

interface SalesData {
  date: string;
  totalSales: number;
  orderCount: number;
}

const SalesAnalytics: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, [dateRange]);

  const fetchSalesData = async () => {
    setLoading(true);
    const salesCollection = collection(db, 'salesOrders');
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
      where('orderDate', '>=', startDate),
      where('orderDate', '<=', endDate)
    );

    try {
      const querySnapshot = await getDocs(q);
      const sales: { [date: string]: { totalSales: number; orderCount: number } } = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = new Date(data.orderDate.seconds * 1000).toISOString().split('T')[0];
        if (!sales[date]) {
          sales[date] = { totalSales: 0, orderCount: 0 };
        }
        sales[date].totalSales += data.totalAmount;
        sales[date].orderCount += 1;
      });

      const formattedData = Object.entries(sales).map(([date, data]) => ({
        date,
        totalSales: data.totalSales,
        orderCount: data.orderCount,
      }));

      setSalesData(formattedData.sort((a, b) => a.date.localeCompare(b.date)));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales data: ", error);
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = salesData.map(data => 
      `${data.date},${data.totalSales},${data.orderCount}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'sales_analytics.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Sales Analytics</h3>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as 'week' | 'month' | 'year')}
            className="p-2 border rounded"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Download size={18} className="mr-2" />
          Export CSV
        </button>
      </div>
      {loading ? (
        <p>Loading sales data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-right">Total Sales</th>
                <th className="py-3 px-6 text-right">Order Count</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {salesData.map((data) => (
                <tr key={data.date} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{data.date}</td>
                  <td className="py-3 px-6 text-right">${data.totalSales.toFixed(2)}</td>
                  <td className="py-3 px-6 text-right">{data.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Summary</h4>
        <p>Total Sales: ${salesData.reduce((sum, data) => sum + data.totalSales, 0).toFixed(2)}</p>
        <p>Total Orders: {salesData.reduce((sum, data) => sum + data.orderCount, 0)}</p>
        <p>Average Order Value: ${(salesData.reduce((sum, data) => sum + data.totalSales, 0) / salesData.reduce((sum, data) => sum + data.orderCount, 0) || 0).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SalesAnalytics;