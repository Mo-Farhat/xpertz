import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ARInvoice } from './types';

interface ARCustomerChartProps {
  invoices: ARInvoice[];
}

export const calculateCustomerTotals = (invoices: ARInvoice[]) => {
  const customerTotals = invoices.reduce((acc, invoice) => {
    if (!acc[invoice.customerName]) {
      acc[invoice.customerName] = 0;
    }
    acc[invoice.customerName] += invoice.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(customerTotals)
    .map(([customer, amount]) => ({
      customer,
      amount
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);
};

const ARCustomerChart: React.FC<ARCustomerChartProps> = ({ invoices }) => {
  const customerData = calculateCustomerTotals(invoices);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers by Receivables</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="customer" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ARCustomerChart;