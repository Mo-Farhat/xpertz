import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { useToast } from "../../../hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchRevenueData, calculateRevenueMetrics, RevenueSource, RevenueMetrics } from '../../../services/revenueTrackingService';
import { TrendingUp, TrendingDown } from 'lucide-react';
const RevenueTracker = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [revenueData, setRevenueData] = useState<RevenueSource[]>([]);
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
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
        const data = await fetchRevenueData(startDate, now);
        setRevenueData(data);
        const calculatedMetrics = calculateRevenueMetrics(data);
        setMetrics(calculatedMetrics);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch revenue data",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, [timeRange, toast]);
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  if (!metrics) return null;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Revenue Tracker</h2>
        <Select value={timeRange} onValueChange={(value: 'week' | 'month' | 'quarter') => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
            <div className="flex items-center mt-2">
              {metrics.periodComparison.percentageChange >= 0 ? (
                <TrendingUp className="text-green-500 mr-2" />
              ) : (
                <TrendingDown className="text-red-500 mr-2" />
              )}
              <span className={metrics.periodComparison.percentageChange >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(metrics.periodComparison.percentageChange).toFixed(1)}% from previous period
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.salesRevenue)}</div>
            <div className="text-gray-500 text-sm">
              {((metrics.salesRevenue / metrics.totalRevenue) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Service Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.serviceRevenue)}</div>
            <div className="text-gray-500 text-sm">
              {((metrics.serviceRevenue / metrics.totalRevenue) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Other Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.otherRevenue)}</div>
            <div className="text-gray-500 text-sm">
              {((metrics.otherRevenue / metrics.totalRevenue) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData.map(item => ({
                date: new Date(item.date).toLocaleDateString(),
                amount: item.amount,
                category: item.category
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default RevenueTracker;s