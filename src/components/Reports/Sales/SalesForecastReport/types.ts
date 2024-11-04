export interface SalesData {
    id: string;
    date: Date;
    total: number;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
  }
  
  export interface ForecastData {
    period: string;
    actualSales: number;
    forecastedSales: number;
    growthRate: number;
    confidence: number;
    seasonalFactor: number;
  }
  