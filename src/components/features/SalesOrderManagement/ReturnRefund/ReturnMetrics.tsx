import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { ReturnRefund, ReturnMetrics } from './types';

interface ReturnMetricsProps {
  data: ReturnRefund[];
}

const calculateMetrics = (returns: ReturnRefund[]): ReturnMetrics => {
  const metrics: ReturnMetrics = {
    totalReturns: returns.length,
    totalAmount: returns.reduce((sum, r) => sum + r.amount, 0),
    pendingCount: returns.filter(r => r.status === 'pending').length,
    approvedCount: returns.filter(r => r.status === 'approved').length,
    rejectedCount: returns.filter(r => r.status === 'rejected').length,
    processedCount: returns.filter(r => r.status === 'processed').length,
    averageProcessingTime: 0
  };

  const processedReturns = returns.filter(r => r.processedDate);
  if (processedReturns.length > 0) {
    const totalDays = processedReturns.reduce((sum, r) => {
      return sum + (r.processedDate!.getTime() - r.requestDate.getTime()) / (1000 * 60 * 60 * 24);
    }, 0);
    metrics.averageProcessingTime = totalDays / processedReturns.length;
  }

  return metrics;
};

const ReturnMetricsDisplay: React.FC<ReturnMetricsProps> = ({ data }) => {
  const metrics = calculateMetrics(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Returns</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{metrics.totalReturns}</p>
          <p className="text-sm text-muted-foreground">Total Amount: ${metrics.totalAmount.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Pending</span>
              <span className="font-bold">{metrics.pendingCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Approved</span>
              <span className="font-bold">{metrics.approvedCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Rejected</span>
              <span className="font-bold">{metrics.rejectedCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processing Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{metrics.averageProcessingTime.toFixed(1)} days</p>
          <p className="text-sm text-muted-foreground">Average processing time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {((metrics.processedCount / metrics.totalReturns) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">Returns processed</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReturnMetricsDisplay;