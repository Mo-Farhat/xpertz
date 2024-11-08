import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Asset } from '../types';

interface AssetDepreciationChartProps {
  assets: Asset[];
}

const AssetDepreciationChart: React.FC<AssetDepreciationChartProps> = ({ assets }) => {
  const chartData = assets.map(asset => ({
    name: asset.name,
    originalValue: asset.purchasePrice,
    currentValue: asset.currentValue,
    depreciation: asset.purchasePrice - asset.currentValue
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Depreciation Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="originalValue" name="Original Value" fill="#4B5563" />
              <Bar dataKey="currentValue" name="Current Value" fill="#3B82F6" />
              <Bar dataKey="depreciation" name="Depreciation" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetDepreciationChart;