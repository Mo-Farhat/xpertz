import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PipelineData {
  id: string;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
  value: number;
  probability: number;
  customer: string;
  product: string;
  expectedCloseDate: Date;
  createdAt: Date;
}

const stages = [
  { value: 'lead', label: 'Lead' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed', label: 'Closed' }
];

const SalesPipelineReport = () => {
  const { tenant } = useTenant();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [pipelineData, setPipelineData] = useState<PipelineData[]>([]);

  useEffect(() => {
    const fetchPipelineData = async () => {
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

      const pipelineQuery = query(
        collection(db, `tenants/${tenant.id}/pipeline`),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(now))
      );

      const snapshot = await getDocs(pipelineQuery);
      const pipeline = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        expectedCloseDate: doc.data().expectedCloseDate.toDate()
      })) as PipelineData[];

      setPipelineData(pipeline);
    };

    fetchPipelineData();
  }, [tenant, timeRange]);

  const getStageMetrics = () => {
    return stages.map(stage => {
      const stageData = pipelineData.filter(item => item.stage === stage.value);
      return {
        name: stage.label,
        count: stageData.length,
        value: stageData.reduce((sum, item) => sum + item.value, 0),
        weightedValue: stageData.reduce((sum, item) => sum + (item.value * item.probability / 100), 0)
      };
    });
  };

  const getTotalMetrics = () => {
    const totalValue = pipelineData.reduce((sum, item) => sum + item.value, 0);
    const weightedValue = pipelineData.reduce((sum, item) => sum + (item.value * item.probability / 100), 0);
    const conversionRate = pipelineData.length > 0 
      ? (pipelineData.filter(item => item.stage === 'closed').length / pipelineData.length * 100).toFixed(1)
      : '0';

    return { totalValue, weightedValue, conversionRate };
  };

  const metrics = getTotalMetrics();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sales Pipeline Report</h3>
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
            <CardTitle>Total Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${metrics.totalValue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weighted Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${metrics.weightedValue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {metrics.conversionRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Stage Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getStageMetrics()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="count" name="Number of Deals" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="value" name="Value ($)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPipelineReport;