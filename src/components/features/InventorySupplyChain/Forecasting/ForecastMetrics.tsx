import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { ForecastMetricsProps } from './types';

const ForecastMetrics: React.FC<ForecastMetricsProps> = ({ forecasts }) => {
  const totalForecasts = forecasts.length;
  const completedForecasts = forecasts.filter(f => f.actualDemand !== undefined).length;
  
  const accuracies = forecasts
    .filter(f => f.actualDemand !== undefined)
    .map(f => {
      const diff = Math.abs((f.actualDemand! - f.predictedDemand) / f.actualDemand!) * 100;
      return 100 - diff;
    });
  
  const averageAccuracy = accuracies.length > 0
    ? accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length
    : 0;

  const totalPredicted = forecasts.reduce((sum, f) => sum + f.predictedDemand, 0);
  const totalActual = forecasts
    .filter(f => f.actualDemand !== undefined)
    .reduce((sum, f) => sum + (f.actualDemand || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{averageAccuracy.toFixed(1)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Forecasts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalForecasts}</p>
          <p className="text-sm text-gray-500">{completedForecasts} completed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Predicted</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalPredicted}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalActual}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastMetrics;