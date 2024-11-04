import React from 'react';
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface RegionMapProps {
  data: Array<{
    region: string;
    totalSales: number;
    orderCount: number;
  }>;
}

const RegionMap: React.FC<RegionMapProps> = ({ data }) => {
  const chartData = data.map(region => ({
    name: region.region,
    sales: region.totalSales,
    orders: region.orderCount
  }));

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="sales" name="Sales ($)" fill="#8884d8" />
          <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#82ca9d" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegionMap;