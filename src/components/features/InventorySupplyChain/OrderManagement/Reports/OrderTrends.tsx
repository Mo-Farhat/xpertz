import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Order } from '../types';

interface OrderTrendsProps {
  orders: Order[];
}

const OrderTrends: React.FC<OrderTrendsProps> = ({ orders }) => {
  const data = orders
    .sort((a, b) => a.orderDate.getTime() - b.orderDate.getTime())
    .map(order => ({
      date: order.orderDate.toLocaleDateString(),
      amount: order.totalAmount
    }));

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#2563eb" 
            name="Order Amount"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderTrends;