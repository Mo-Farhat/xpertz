import { Timestamp } from 'firebase/firestore';

export const processHistoricalData = (salesData: any[], forecastPeriod: 'month' | 'quarter' | 'year') => {
  return salesData.reduce((acc: any[], sale) => {
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
  }, []).sort((a, b) => a.period.localeCompare(b.period));
};

export const calculateHistoricalSales = (salesData: any[], itemId: string) => {
  return salesData.filter(sale => 
    sale.products?.some((product: any) => product.id === itemId)
  );
};

export const calculateForecast = (historicalSales: any[]) => {
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
  
  const squaredDiffs = historicalSales.map(sale => Math.pow(sale.total - average, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / (historicalSales.length - 1);
  const stdDev = Math.sqrt(variance);
  
  const confidence = Math.max(0, Math.min(100, 100 * (1 - (stdDev / average))));
  return confidence;
};