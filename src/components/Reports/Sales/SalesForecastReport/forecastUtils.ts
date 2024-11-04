import { SalesData, ForecastData } from './types';

export const calculateForecast = (
  salesData: SalesData[],
  timeRange: 'month' | 'quarter' | 'year'
): ForecastData[] => {
  // Group sales by period
  const groupedSales = groupSalesByPeriod(salesData, timeRange);
  
  // Calculate growth rate and seasonal factors
  const periods = Object.keys(groupedSales).sort();
  const growthRates = calculateGrowthRates(groupedSales, periods);
  const seasonalFactors = calculateSeasonalFactors(groupedSales, timeRange);
  
  // Generate forecast data
  return periods.map((period, index) => {
    const actualSales = groupedSales[period] || 0;
    const previousPeriodSales = index > 0 ? groupedSales[periods[index - 1]] : actualSales;
    const growthRate = growthRates[period] || 0;
    const seasonalFactor = seasonalFactors[period] || 1;
    
    const forecastedSales = previousPeriodSales * (1 + growthRate) * seasonalFactor;
    const confidence = calculateConfidence(actualSales, forecastedSales);

    return {
      period,
      actualSales,
      forecastedSales,
      growthRate,
      confidence,
      seasonalFactor
    };
  });
};

const groupSalesByPeriod = (
  salesData: SalesData[],
  timeRange: 'month' | 'quarter' | 'year'
): Record<string, number> => {
  return salesData.reduce((acc, sale) => {
    const date = sale.date;
    const period = formatPeriod(date, timeRange);
    acc[period] = (acc[period] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);
};

const formatPeriod = (date: Date, timeRange: 'month' | 'quarter' | 'year'): string => {
  switch (timeRange) {
    case 'month':
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    case 'quarter':
      return `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
    case 'year':
      return date.getFullYear().toString();
  }
};

const calculateGrowthRates = (
  groupedSales: Record<string, number>,
  periods: string[]
): Record<string, number> => {
  return periods.reduce((acc, period, index) => {
    if (index === 0) {
      acc[period] = 0;
    } else {
      const currentSales = groupedSales[period];
      const previousSales = groupedSales[periods[index - 1]];
      acc[period] = previousSales ? (currentSales - previousSales) / previousSales : 0;
    }
    return acc;
  }, {} as Record<string, number>);
};

const calculateSeasonalFactors = (
  groupedSales: Record<string, number>,
  timeRange: 'month' | 'quarter' | 'year'
): Record<string, number> => {
  const seasonalFactors: Record<string, number> = {};
  const periodTotals: Record<string, number[]> = {};
  
  // Group sales by season (month/quarter)
  Object.entries(groupedSales).forEach(([period, sales]) => {
    const seasonKey = getPeriodKey(period, timeRange);
    if (!periodTotals[seasonKey]) {
      periodTotals[seasonKey] = [];
    }
    periodTotals[seasonKey].push(sales);
  });
  
  // Calculate average for each season
  const seasonAverages = Object.entries(periodTotals).reduce((acc, [season, sales]) => {
    acc[season] = sales.reduce((sum, sale) => sum + sale, 0) / sales.length;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate overall average
  const overallAverage = Object.values(seasonAverages)
    .reduce((sum, avg) => sum + avg, 0) / Object.keys(seasonAverages).length;
  
  // Calculate seasonal factors
  Object.entries(groupedSales).forEach(([period, _]) => {
    const seasonKey = getPeriodKey(period, timeRange);
    seasonalFactors[period] = seasonAverages[seasonKey] / overallAverage;
  });
  
  return seasonalFactors;
};

const getPeriodKey = (period: string, timeRange: 'month' | 'quarter' | 'year'): string => {
  switch (timeRange) {
    case 'month':
      return period.split('-')[1]; // Month number
    case 'quarter':
      return period.split('-')[1]; // Quarter number
    case 'year':
      return period; // Year
  }
};

const calculateConfidence = (actual: number, forecasted: number): number => {
  const difference = Math.abs(actual - forecasted);
  const percentageError = actual ? difference / actual : 1;
  return Math.max(0, Math.min(100, 100 * (1 - percentageError)));
};