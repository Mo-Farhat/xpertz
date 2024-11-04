import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface CustomerPurchaseChartProps {
  data: Array<{
    date: Date;
    total: number;
  }>;
}

const CustomerPurchaseChart: React.FC<CustomerPurchaseChartProps> = ({ data }) => {
  const chartData = data.map(purchase => ({
    date: purchase.date.toLocaleDateString(),
    amount: purchase.total
  }));

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" name="Purchase Amount ($)" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerPurchaseChart;