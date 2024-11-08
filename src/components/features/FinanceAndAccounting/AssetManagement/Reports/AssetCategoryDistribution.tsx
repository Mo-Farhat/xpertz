import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Asset } from '../types';

interface AssetCategoryDistributionProps {
  assets: Asset[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AssetCategoryDistribution: React.FC<AssetCategoryDistributionProps> = ({ assets }) => {
  const categoryData = assets.reduce((acc, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = {
        value: 0,
        count: 0
      };
    }
    acc[asset.category].value += asset.currentValue;
    acc[asset.category].count += 1;
    return acc;
  }, {} as Record<string, { value: number; count: number }>);

  const chartData = Object.entries(categoryData).map(([category, data]) => ({
    name: category,
    value: data.value,
    count: data.count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetCategoryDistribution;