import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VendorMetrics {
  vendorId: string;
  vendorName: string;
  onTimeDeliveries: number;
  totalOrders: number;
  qualityRating: number;
  responseTime: number;
  totalSpend: number;
}

const VendorPerformance = () => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [metrics, setMetrics] = useState<VendorMetrics[]>([]);

  useEffect(() => {
    const fetchVendorMetrics = async () => {
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      const ordersQuery = query(
        collection(db, 'purchaseOrders'),
        where('orderDate', '>=', Timestamp.fromDate(startDate))
      );

      const ordersSnapshot = await getDocs(ordersQuery);
      const vendorMetricsMap = new Map<string, VendorMetrics>();

      ordersSnapshot.docs.forEach(doc => {
        const order = doc.data();
        const metrics = vendorMetricsMap.get(order.vendorId) || {
          vendorId: order.vendorId,
          vendorName: order.vendorName,
          onTimeDeliveries: 0,
          totalOrders: 0,
          qualityRating: 0,
          responseTime: 0,
          totalSpend: 0
        };

        metrics.totalOrders++;
        metrics.totalSpend += order.totalAmount;
        if (order.deliveredOnTime) metrics.onTimeDeliveries++;
        
        vendorMetricsMap.set(order.vendorId, metrics);
      });

      setMetrics(Array.from(vendorMetricsMap.values()));
    };

    fetchVendorMetrics();
  }, [timeRange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vendor Performance Metrics</h3>
        <Select value={timeRange} onValueChange={(value: 'month' | 'quarter' | 'year') => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>On-Time Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vendorName" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey={(metric) => (metric.onTimeDeliveries / metric.totalOrders) * 100} 
                    fill="#4f46e5" 
                    name="On-Time Delivery %" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Spend by Vendor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vendorName" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalSpend" fill="#10b981" name="Total Spend" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vendorName" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalOrders" fill="#f59e0b" name="Total Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorPerformance;