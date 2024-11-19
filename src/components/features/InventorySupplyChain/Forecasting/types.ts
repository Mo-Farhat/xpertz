export interface ForecastItem {
    id: string;
    itemId: string;
    itemName: string;
    forecastDate: Date;
    predictedDemand: number;
    actualDemand?: number;
    accuracy?: number;
  }
  
  export interface ForecastFormData extends Omit<ForecastItem, 'id'> {}
  
  export interface ForecastMetrics {
    totalForecasts: number;
    averageAccuracy: number;
    completedForecasts: number;
    pendingForecasts: number;
  }

  export interface HistoricalDataPoint {
    period: string;
    totalSales: number;
  }

  export interface ForecastItem {
    id: string;
    itemId: string;
    itemName: string;
    forecastDate: Date;
    predictedDemand: number;
    actualDemand?: number;
    accuracy?: number;
  }
  
  export interface ForecastMetricsProps {
    forecasts: ForecastItem[];
  }
  
  export interface ForecastFormProps {
    forecast: Omit<ForecastItem, 'id'>;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (forecast: Omit<ForecastItem, 'id'>) => void;
  }
  
  export interface ForecastTableProps {
    forecasts: ForecastItem[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
  }
  
  export interface ForecastHeaderProps {
    onAutoGenerate: () => void;
    onExport: () => void;
  }