import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RetentionChartProps {
  data: Array<{
    period: string;
    retentionRate: number;
    churnRate: number;
  }>;
}

const RetentionChart: React.FC<RetentionChartProps> = ({ data }) => {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="retentionRate" 
            name="Retention Rate" 
            stroke="#10B981" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="churnRate" 
            name="Churn Rate" 
            stroke="#EF4444" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RetentionChart;