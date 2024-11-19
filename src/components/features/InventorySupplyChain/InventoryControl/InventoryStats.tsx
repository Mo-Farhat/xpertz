import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { InventoryStats } from './types';

interface InventoryStatsProps {
  stats: InventoryStats;
}

const InventoryStatsDisplay: React.FC<InventoryStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalItems}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-yellow-600">Low Stock Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-600">Out of Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryStatsDisplay;