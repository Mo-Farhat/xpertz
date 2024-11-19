import { ForecastItem } from './types';

export const calculateSeasonalityPattern = (historicalData: ForecastItem[]): number => {
  if (historicalData.length < 12) return 1;

  const monthlyAverages = new Array(12).fill(0);
  const monthCounts = new Array(12).fill(0);

  historicalData.forEach(item => {
    const month = new Date(item.forecastDate).getMonth();
    monthlyAverages[month] += item.actualDemand || 0;
    monthCounts[month]++;
  });

  const yearlyAverage = monthlyAverages.reduce((sum, val) => sum + val, 0) / 12;
  const currentMonth = new Date().getMonth();
  
  return monthlyAverages[currentMonth] / yearlyAverage || 1;
};

export const calculateTrendFactor = (historicalData: ForecastItem[]): number => {
  if (historicalData.length < 2) return 1;

  const sortedData = [...historicalData].sort((a, b) => 
    new Date(a.forecastDate).getTime() - new Date(b.forecastDate).getTime()
  );

  const recentAvg = sortedData.slice(-3).reduce((sum, item) => sum + (item.actualDemand || 0), 0) / 3;
  const oldAvg = sortedData.slice(0, 3).reduce((sum, item) => sum + (item.actualDemand || 0), 0) / 3;

  return recentAvg / oldAvg || 1;
};

export const generateAutomatedForecast = (
  historicalData: ForecastItem[],
  itemId: string,
  itemName: string
): Omit<ForecastItem, 'id'> => {
  const seasonalFactor = calculateSeasonalityPattern(historicalData);
  const trendFactor = calculateTrendFactor(historicalData);
  
  const recentDemand = historicalData
    .slice(-3)
    .reduce((sum, item) => sum + item.predictedDemand, 0) / 3;

  const predictedDemand = Math.round(recentDemand * seasonalFactor * trendFactor);

  return {
    itemId,
    itemName,
    forecastDate: new Date(),
    predictedDemand,
  };
};