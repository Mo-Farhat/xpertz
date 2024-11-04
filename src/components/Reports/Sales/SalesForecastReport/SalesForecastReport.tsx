import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useTenant } from '../../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import ForecastMetrics from './ForecastMetrics';
import ForecastChart from './ForecastChart';
import ForecastTable from './ForecastTable';
import { calculateForecast } from './forecastUtils';
import { SalesData, ForecastData } from './types';

const SalesForecastReport = () => {
  const { tenant } = useTenant();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!tenant) return;
      setIsLoading(true);

      try {
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
          case 'month':
            startDate.setMonth(now.getMonth() - 12); // Last 12 months for monthly forecast
            break;
          case 'quarter':
            startDate.setMonth(now.getMonth() - 24); // Last 24 months for quarterly forecast
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 3); // Last 3 years for yearly forecast
            break;
        }

        const salesQuery = query(
          collection(db, `tenants/${tenant.id}/sales`),
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(now)),
          orderBy('date', 'desc')
        );

        const snapshot = await getDocs(salesQuery);
        const salesData: SalesData[] = snapshot.docs.map(doc => ({
          id: doc.id,
          date: doc.data().date.toDate(),
          total: doc.data().total,
          items: doc.data().items
        }));

        const forecast = calculateForecast(salesData, timeRange);
        setForecastData(forecast);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, [tenant, timeRange]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sales Forecast Report</h3>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select forecast period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Monthly Forecast</SelectItem>
            <SelectItem value="quarter">Quarterly Forecast</SelectItem>
            <SelectItem value="year">Yearly Forecast</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ForecastMetrics data={forecastData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Forecast Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastChart data={forecastData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forecast Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastTable data={forecastData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesForecastReport;