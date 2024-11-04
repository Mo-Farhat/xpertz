import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SatisfactionChartProps {
  data: Array<{
    createdAt: Date;
    rating: number;
  }>;
}

const SatisfactionChart: React.FC<SatisfactionChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    date: item.createdAt.toLocaleDateString(),
    rating: item.rating
  }));

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="rating" 
            name="Customer Rating" 
            stroke="#8884d8" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SatisfactionChart;