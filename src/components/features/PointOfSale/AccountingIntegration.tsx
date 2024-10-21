import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { DollarSign, Download } from 'lucide-react';

interface SalesSummary {
  date: string;
  totalSales: number;
  cashSales: number;
  cardSales: number;
  taxCollected: number;
}

const AccountingIntegration: React.FC = () => {
  const [salesSummary, setSalesSummary] = useState<SalesSummary[]>([]);
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    fetchSalesSummary();
  }, [dateRange]);

  const fetchSalesSummary = async () => {
    const salesCollection = collection(db, 'sales');
    const endDate = new Date();
    const startDate = new Date();

    switch (dateRange) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
    }

    const q = query(
      salesCollection,
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );

    try {
      const querySnapshot = await getDocs(q);
      const summaryData: { [date: string]: SalesSummary } = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = new Date(data.date.seconds * 1000).toISOString().split('T')[0];
        if (!summaryData[date]) {
          summaryData[date] = { date, totalSales: 0, cashSales: 0, cardSales: 0, taxCollected: 0 };
        }
        summaryData[date].totalSales += data.total;
        if (data.paymentMethod === 'cash') {
          summaryData[date].cashSales += data.total;
        } else {
          summaryData[date].cardSales += data.total;
        }
        summaryData[date].taxCollected += data.total * 0.1; // Assuming 10% tax rate
      });

      setSalesSummary(Object.values(summaryData).sort((a, b) => a.date.localeCompare(b.date)));
    } catch (error) {
      console.error("Error fetching sales summary: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = salesSummary.map(summary => 
      `${summary.date},${summary.totalSales},${summary.cashSales},${summary.cardSales},${summary.taxCollected}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'sales_summary.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Accounting Integration</h3>
      <div className="mb-4">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as 'day' | 'week' | 'month')}
          className="p-2 border rounded mr-2"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <Download size={18} className="inline mr-2" />
          Export CSV
        </button>
      </div>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-right">Total Sales</th>
            <th className="py-3 px-6 text-right">Cash Sales</th>
            <th className="py-3 px-6 text-right">Card Sales</th>
            <th className="py-3 px-6 text-right">Tax Collected</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {salesSummary.map((summary) => (
            <tr key={summary.date} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{summary.date}</td>
              <td className="py-3 px-6 text-right">
                <DollarSign size={18} className="inline mr-1" />
                {summary.totalSales.toFixed(2)}
              </td>
              <td className="py-3 px-6 text-right">${summary.cashSales.toFixed(2)}</td>
              <td className="py-3 px-6 text-right">${summary.cardSales.toFixed(2)}</td>
              <td className="py-3 px-6 text-right">${summary.taxCollected.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountingIntegration;