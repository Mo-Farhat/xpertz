import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

interface RegionMetricsProps {
  data: Array<{
    region: string;
    totalSales: number;
    orderCount: number;
    averageOrderValue: number;
  }>;
}

const RegionMetrics: React.FC<RegionMetricsProps> = ({ data }) => {
  const totalSales = data.reduce((sum, region) => sum + region.totalSales, 0);
  const totalOrders = data.reduce((sum, region) => sum + region.orderCount, 0);
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const topRegion = data.reduce((max, region) => 
    region.totalSales > max.totalSales ? region : max, data[0] || { region: 'None', totalSales: 0 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Regional Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Order Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Region</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{topRegion.region}</p>
          <p className="text-sm text-gray-500">${topRegion.totalSales.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegionMetrics;