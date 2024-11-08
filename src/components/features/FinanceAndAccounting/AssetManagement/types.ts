export interface Asset {
    id: string;
    name: string;
    purchaseDate: Date;
    purchasePrice: number;
    currentValue: number;
    category: string;
    depreciationMethod: 'straight-line' | 'declining-balance' | 'units-of-production';
    usefulLife: number;
  }
  
  export interface AssetSummaryMetrics {
    totalAssets: number;
    totalValue: number;
    totalDepreciation: number;
    averageAge: number;
    categoryBreakdown: Record<string, { count: number; value: number }>;
  }