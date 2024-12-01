import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  Cell, ResponsiveContainer
} from 'recharts';
import ChartWidget from './ChartWidget';

interface DashboardChartsProps {
  selectedWidgets: string[];
  salesData: any[];
  topProducts: any[];
  inventoryData: any[];
  colors: string[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  selectedWidgets,
  salesData,
  topProducts,
  inventoryData,
  colors
}) => {
  return (
    <>
      <ChartWidget
        title="Sales Trend"
        isVisible={selectedWidgets.includes('salesTrend')}
        chart={
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#3B82F6" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        }
      />

      <ChartWidget
        title="Top Products"
        isVisible={selectedWidgets.includes('topProducts')}
        chart={
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      <ChartWidget
        title="Inventory Distribution"
        isVisible={selectedWidgets.includes('inventoryDistribution')}
        chart={
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        }
      />
    </>
  );
};

export default DashboardCharts;