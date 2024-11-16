export interface DayBookEntry {
  id: string;
  timestamp: Date;
  transactionType: 'sale' | 'purchase' | 'payment' | 'receipt' | 'journal' | 'manual';
  reference: string;
  description: string;
  debit: number;
  credit: number;
  account: string;
  status: 'pending' | 'posted' | 'voided';
  userId: string;
  moduleId?: string;
  category?: string;
  notes?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}