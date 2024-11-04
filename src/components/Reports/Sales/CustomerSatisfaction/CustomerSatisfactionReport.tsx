import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useTenant } from '../../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import SatisfactionMetrics from './SatisfactionMetrics';
import SatisfactionChart from './SatisfactionChart';
import FeedbackTable from './FeedbackTable';

const CustomerSatisfactionReport = () => {
  const { tenant } = useTenant();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [satisfactionData, setSatisfactionData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSatisfactionData = async () => {
      if (!tenant) return;
      setIsLoading(true);

      try {
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

        const feedbackQuery = query(
          collection(db, `tenants/${tenant.id}/customerFeedback`),
          where('createdAt', '>=', Timestamp.fromDate(startDate)),
          where('createdAt', '<=', Timestamp.fromDate(now)),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(feedbackQuery);
        const feedback = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
        }));

        setSatisfactionData(feedback);
      } catch (error) {
        console.error('Error fetching satisfaction data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSatisfactionData();
  }, [tenant, timeRange]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Customer Satisfaction Analysis</h3>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SatisfactionMetrics data={satisfactionData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Satisfaction Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <SatisfactionChart data={satisfactionData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <FeedbackTable data={satisfactionData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerSatisfactionReport;