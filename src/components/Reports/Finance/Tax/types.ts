export interface TaxSummary {
    totalTaxLiability: number;
    paidTaxes: number;
    pendingTaxes: number;
    overdueTaxes: number;
    taxesByType: Record<string, number>;
    taxesByRegion: Record<string, number>;
    upcomingPayments: Array<TaxPayment>;
  }
  
  export interface TaxPayment {
    type: string;
    amount: number;
    dueDate: Date;
  }
  
  export interface TaxRecord {
    id: string;
    taxYear: number;
    taxType: string;
    amount: number;
    dueDate: Date;
    status: 'pending' | 'paid' | 'overdue';
    region: string;
  }
  
  export interface ChartDataItem {
    type: string;
    amount: number;
  }