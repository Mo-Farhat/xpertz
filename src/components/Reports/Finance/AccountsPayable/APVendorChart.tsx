import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Invoice } from '@/components/features/FinanceAndAccounting/AccountsPayable/types';

interface APVendorChartProps {
  invoices: Invoice[];
}

export const APVendorChart: React.FC<APVendorChartProps> = ({ invoices }) => {
  const calculateVendorTotals = () => {
    const vendorTotals = invoices.reduce((acc, invoice) => {
      if (!acc[invoice.vendorName]) {
        acc[invoice.vendorName] = 0;
      }
      acc[invoice.vendorName] += invoice.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(vendorTotals)
      .map(([vendor, amount]) => ({
        vendor,
        amount
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Top 10 vendors
  };

  const data = calculateVendorTotals();

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="vendor" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};