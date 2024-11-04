import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import RegionMetrics from './Region/RegionMetrics';
import RegionMap from './Region/RegionMap';
import RegionPerformanceTable from './Region/RegionPerformanceTable';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface RegionData {
  region: string;
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  growth: number;
}

const SalesByRegionReport = () => {
  const { tenant } = useTenant();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegionData = async () => {
      if (!tenant) return;
      setIsLoading(true);

      try {
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'quarter':
            startDate.setMonth(now.getMonth() - 3);
            break;
        }

        const salesQuery = query(
          collection(db, `tenants/${tenant.id}/sales`),
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(now))
        );

        const snapshot = await getDocs(salesQuery);
        const regionMap = new Map<string, RegionData>();

        snapshot.docs.forEach(doc => {
          const sale = doc.data();
          const region = sale.region || 'Unspecified';

          const existing = regionMap.get(region) || {
            region,
            totalSales: 0,
            orderCount: 0,
            averageOrderValue: 0,
            topProducts: [],
            growth: 0
          };

          existing.totalSales += sale.total;
          existing.orderCount += 1;
          existing.averageOrderValue = existing.totalSales / existing.orderCount;

          // Process products for this sale
          sale.products.forEach((product: any) => {
            const productIndex = existing.topProducts.findIndex(p => p.name === product.name);
            if (productIndex >= 0) {
              existing.topProducts[productIndex].quantity += product.quantity;
              existing.topProducts[productIndex].revenue += product.total;
            } else {
              existing.topProducts.push({
                name: product.name,
                quantity: product.quantity,
                revenue: product.total
              });
            }
          });

          // Sort and limit top products
          existing.topProducts.sort((a, b) => b.revenue - a.revenue);
          existing.topProducts = existing.topProducts.slice(0, 5);

          regionMap.set(region, existing);
        });

        setRegionData(Array.from(regionMap.values()));
      } catch (error) {
        console.error('Error fetching region data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegionData();
  }, [tenant, timeRange]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sales by Region Report</h3>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <RegionMetrics data={regionData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <RegionMap data={regionData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Details</CardTitle>
          </CardHeader>
          <CardContent>
            <RegionPerformanceTable data={regionData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesByRegionReport;