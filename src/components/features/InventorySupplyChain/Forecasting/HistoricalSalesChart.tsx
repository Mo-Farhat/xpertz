import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { HistoricalDataPoint } from './types';

interface HistoricalSalesChartProps {
  data: HistoricalDataPoint[];
}

const HistoricalSalesChart: React.FC<HistoricalSalesChartProps> = ({ data }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Historical Sales Trend</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" name="Sales" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoricalSalesChart;