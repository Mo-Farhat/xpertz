import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Download } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ForecastItem {
  id: string;
  name: string;
  currentStock: number;
  averageDemand: number;
  seasonalFactor: number;
  predictedDemand: number;
  recommendedOrder: number;
  confidence: number;
}

const DemandForecastReport = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [forecastPeriod, setForecastPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [items, setItems] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    const fetchForecastData = async () => {
      if (!tenant) return;
      
      try {
        setLoading(true);
        const now = new Date();
        let startDate = new Date();
        
        switch (forecastPeriod) {
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

        // Fetch historical sales data
        const salesQuery = query(
          collection(db, 'sales'),
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(now))
        );
        
        const salesSnapshot = await getDocs(salesQuery);
        const salesData = salesSnapshot.docs.map(doc => ({
          date: doc.data().date.toDate(),
          ...doc.data()
        }));

        // Process historical data for the chart
        const processedData = processHistoricalData(salesData);
        setHistoricalData(processedData);

        // Calculate forecasts
        const inventoryQuery = query(collection(db, 'inventory'));
        const inventorySnapshot = await getDocs(inventoryQuery);
        
        const forecastData = inventorySnapshot.docs.map(doc => {
          const itemData = doc.data();
          const historicalSales = calculateHistoricalSales(salesData, doc.id);
          const forecast = calculateForecast(historicalSales);
          
          return {
            id: doc.id,
            name: itemData.name,
            currentStock: itemData.quantity || 0,
            averageDemand: forecast.average,
            seasonalFactor: forecast.seasonalFactor,
            predictedDemand: forecast.predicted,
            recommendedOrder: Math.max(0, forecast.predicted - itemData.quantity),
            confidence: forecast.confidence
          };
        });

        setItems(forecastData);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
        toast({
          title: "Error",
          description: "Failed to load demand forecast data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [tenant, forecastPeriod, toast]);

  const processHistoricalData = (salesData: any[]) => {
    // Group sales by month/quarter/year
    const groupedData = salesData.reduce((acc: any[], sale) => {
      const date = new Date(sale.date);
      const period = forecastPeriod === 'month' 
        ? `${date.getFullYear()}-${date.getMonth() + 1}`
        : forecastPeriod === 'quarter'
        ? `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`
        : date.getFullYear().toString();

      const existingPeriod = acc.find(item => item.period === period);
      if (existingPeriod) {
        existingPeriod.totalSales += sale.total;
      } else {
        acc.push({ period, totalSales: sale.total });
      }
      return acc;
    }, []);

    return groupedData.sort((a, b) => a.period.localeCompare(b.period));
  };

  const calculateHistoricalSales = (salesData: any[], itemId: string) => {
    return salesData.filter(sale => 
      sale.products?.some((product: any) => product.id === itemId)
    );
  };

  const calculateForecast = (historicalSales: any[]) => {
    // Simple moving average with seasonal adjustment
    const average = historicalSales.reduce((sum, sale) => sum + sale.total, 0) / historicalSales.length;
    const seasonalFactor = calculateSeasonalFactor(historicalSales);
    const predicted = average * seasonalFactor;
    const confidence = calculateConfidence(historicalSales, average);

    return {
      average,
      seasonalFactor,
      predicted,
      confidence
    };
  };

  const calculateSeasonalFactor = (historicalSales: any[]) => {
    // Simple seasonal factor calculation
    const currentMonth = new Date().getMonth();
    const similarMonthSales = historicalSales.filter(sale => 
      new Date(sale.date).getMonth() === currentMonth
    );
    
    if (similarMonthSales.length === 0) return 1;
    
    const seasonalAverage = similarMonthSales.reduce((sum, sale) => sum + sale.total, 0) / similarMonthSales.length;
    const overallAverage = historicalSales.reduce((sum, sale) => sum + sale.total, 0) / historicalSales.length;
    
    return seasonalAverage / overallAverage;
  };

  const calculateConfidence = (historicalSales: any[], average: number) => {
    if (historicalSales.length < 2) return 0;
    
    // Calculate standard deviation
    const squaredDiffs = historicalSales.map(sale => Math.pow(sale.total - average, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / (historicalSales.length - 1);
    const stdDev = Math.sqrt(variance);
    
    // Convert to confidence percentage (inverse of coefficient of variation)
    const confidence = Math.max(0, Math.min(100, 100 * (1 - (stdDev / average))));
    return confidence;
  };

  const handleExport = () => {
    const csvContent = [
      ['Item Name', 'Current Stock', 'Average Demand', 'Seasonal Factor', 'Predicted Demand', 'Recommended Order', 'Confidence (%)'],
      ...items.map(item => [
        item.name,
        item.currentStock,
        item.averageDemand.toFixed(2),
        item.seasonalFactor.toFixed(2),
        item.predictedDemand.toFixed(2),
        item.recommendedOrder,
        item.confidence.toFixed(1)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `demand_forecast_${forecastPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Demand Forecast Report</CardTitle>
            <p className="text-sm text-gray-500 mt-2">
              Predictions based on historical sales data and seasonal trends
            </p>
          </div>
          <div className="flex gap-4">
            <Select value={forecastPeriod} onValueChange={(value: 'month' | 'quarter' | 'year') => setForecastPeriod(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select forecast period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly Forecast</SelectItem>
                <SelectItem value="quarter">Quarterly Forecast</SelectItem>
                <SelectItem value="year">Yearly Forecast</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Historical Sales Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalSales" stroke="#8884d8" name="Sales" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right">Average Demand</TableHead>
                <TableHead className="text-right">Seasonal Factor</TableHead>
                <TableHead className="text-right">Predicted Demand</TableHead>
                <TableHead className="text-right">Recommended Order</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.currentStock}</TableCell>
                  <TableCell className="text-right">{item.averageDemand.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.seasonalFactor.toFixed(2)}x</TableCell>
                  <TableCell className="text-right">{item.predictedDemand.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.recommendedOrder}</TableCell>
                  <TableCell className="text-right">{item.confidence.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandForecastReport;