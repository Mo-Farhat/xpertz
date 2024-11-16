import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from './types';

interface MovementChartProps {
  data: ChartDataPoint[];
}

const MovementChart: React.FC<MovementChartProps> = ({ data }) => {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="inbound" 
            stroke="#10b981" 
            name="Inbound"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="outbound" 
            stroke="#ef4444" 
            name="Outbound"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MovementChart;