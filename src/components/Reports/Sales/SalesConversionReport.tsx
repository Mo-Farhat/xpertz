import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ConversionData {
  id: string;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
  source: string;
  createdAt: Date;
  convertedAt?: Date;
  converted: boolean;
}

const SalesConversionReport = () => {
  const { tenant } = useTenant();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [conversionData, setConversionData] = useState<ConversionData[]>([]);

  useEffect(() => {
    const fetchConversionData = async () => {
      if (!tenant) return;

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

      const leadsQuery = query(
        collection(db, `tenants/${tenant.id}/leads`),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(now))
      );

      const snapshot = await getDocs(leadsQuery);
      const leads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        convertedAt: doc.data().convertedAt?.toDate()
      })) as ConversionData[];

      setConversionData(leads);
    };

    fetchConversionData();
  }, [tenant, timeRange]);

  const getConversionMetrics = () => {
    const totalLeads = conversionData.length;
    const convertedLeads = conversionData.filter(lead => lead.converted).length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(1) : '0';
    
    const sourceMetrics = conversionData.reduce((acc, lead) => {
      if (!acc[lead.source]) {
        acc[lead.source] = { total: 0, converted: 0 };
      }
      acc[lead.source].total++;
      if (lead.converted) {
        acc[lead.source].converted++;
      }
      return acc;
    }, {} as Record<string, { total: number; converted: number }>);

    return {
      totalLeads,
      convertedLeads,
      conversionRate,
      sourceMetrics
    };
  };

  const getTimeSeriesData = () => {
    const data = conversionData.reduce((acc, lead) => {
      const date = lead.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!acc[date]) {
        acc[date] = { date, total: 0, converted: 0 };
      }
      acc[date].total++;
      if (lead.converted) {
        acc[date].converted++;
      }
      return acc;
    }, {} as Record<string, { date: string; total: number; converted: number }>);

    return Object.values(data).map(item => ({
      ...item,
      conversionRate: (item.converted / item.total * 100).toFixed(1)
    }));
  };

  const metrics = getConversionMetrics();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sales Conversion Report</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.totalLeads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Converted Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.convertedLeads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversion Rate Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getTimeSeriesData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="conversionRate" name="Conversion Rate (%)" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversion by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.sourceMetrics).map(([source, data]) => (
              <div key={source} className="flex justify-between items-center">
                <span className="font-medium">{source}</span>
                <div className="text-right">
                  <p className="font-semibold">
                    {(data.converted / data.total * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {data.converted} / {data.total} leads
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesConversionReport;