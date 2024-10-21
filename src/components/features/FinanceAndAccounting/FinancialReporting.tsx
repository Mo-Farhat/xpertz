import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Download, FileText } from 'lucide-react';

interface FinancialData {
  revenue: number;
  expenses: number;
  assets: number;
  liabilities: number;
}

const FinancialReporting: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    revenue: 0,
    expenses: 0,
    assets: 0,
    liabilities: 0,
  });
  const [reportType, setReportType] = useState<'income' | 'balance' | 'cashflow'>('income');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    fetchFinancialData();
  }, [reportType, startDate, endDate]);

  const fetchFinancialData = async () => {
    try {
      const revenueQuery = query(
        collection(db, 'transactions'),
        where('type', '==', 'income'),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate))
      );
      const expensesQuery = query(
        collection(db, 'transactions'),
        where('type', '==', 'expense'),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate))
      );
      const assetsQuery = query(collection(db, 'assets'));
      const liabilitiesQuery = query(collection(db, 'liabilities'));

      const [revenueSnapshot, expensesSnapshot, assetsSnapshot, liabilitiesSnapshot] = await Promise.all([
        getDocs(revenueQuery),
        getDocs(expensesQuery),
        getDocs(assetsQuery),
        getDocs(liabilitiesQuery)
      ]);

      const revenue = revenueSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
      const expenses = expensesSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
      const assets = assetsSnapshot.docs.reduce((sum, doc) => sum + doc.data().currentValue, 0);
      const liabilities = liabilitiesSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);

      setFinancialData({ revenue, expenses, assets, liabilities });
    } catch (error) {
      console.error('Error fetching financial data:', error);
    }
  };

  const generateReport = () => {
    let report = '';
    switch (reportType) {
      case 'income':
        report = `Income Statement\n\nRevenue: $${financialData.revenue.toFixed(2)}\nExpenses: $${financialData.expenses.toFixed(2)}\nNet Income: $${(financialData.revenue - financialData.expenses).toFixed(2)}`;
        break;
      case 'balance':
        report = `Balance Sheet\n\nAssets: $${financialData.assets.toFixed(2)}\nLiabilities: $${financialData.liabilities.toFixed(2)}\nEquity: $${(financialData.assets - financialData.liabilities).toFixed(2)}`;
        break;
      case 'cashflow':
        report = `Cash Flow Statement\n\nCash from Operations: $${(financialData.revenue - financialData.expenses).toFixed(2)}\nCash from Investing: $0.00\nCash from Financing: $0.00\nNet Cash Flow: $${(financialData.revenue - financialData.expenses).toFixed(2)}`;
        break;
    }
    return report;
  };

  const handleExport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportType}_report.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Financial Reporting</h2>
      <div className="mb-4">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as 'income' | 'balance' | 'cashflow')}
          className="p-2 border rounded mr-2"
        >
          <option value="income">Income Statement</option>
          <option value="balance">Balance Sheet</option>
          <option value="cashflow">Cash Flow Statement</option>
        </select>
        <input
          type="date"
          value={startDate.toISOString().split('T')[0]}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          className="p-2 border rounded mr-2"
        />
        <input
          type="date"
          value={endDate.toISOString().split('T')[0]}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Download size={18} className="mr-2" />
          Export Report
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">
          {reportType === 'income' ? 'Income Statement' :
           reportType === 'balance' ? 'Balance Sheet' :
           'Cash Flow Statement'}
        </h3>
        <pre className="whitespace-pre-wrap">{generateReport()}</pre>
      </div>
    </div>
  );
};

export default FinancialReporting;