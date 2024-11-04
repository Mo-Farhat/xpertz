import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { ForecastData } from './types';

interface ForecastMetricsProps {
  data: ForecastData[];
}

const ForecastMetrics: React.FC<ForecastMetricsProps> = ({ data }) => {
  const latestPeriod = data[data.length - 1];
  const averageGrowth = data.reduce((sum, item) => sum + item.growthRate, 0) / data.length;
  const averageConfidence = data.reduce((sum, item) => sum + item.confidence, 0) / data.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Forecasted Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${latestPeriod?.forecastedSales.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Growth Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {(averageGrowth * 100).toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seasonal Factor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {latestPeriod?.seasonalFactor.toFixed(2)}x
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forecast Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {averageConfidence.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastMetrics;