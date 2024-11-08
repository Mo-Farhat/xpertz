export interface BankTransaction {
    id: string;
    date: Date;
    description: string;
    amount: number;
    type: 'credit' | 'debit';
    reconciled: boolean;
    category: string;
    referenceNumber: string;
    notes: string;
    paymentMethod: string;
    status: 'pending' | 'completed' | 'cancelled';
  }
  
  export interface BankingMetrics {
    totalCredits: number;
    totalDebits: number;
    netBalance: number;
    reconciledCount: number;
    unreconciledCount: number;
    reconciledPercentage: number;
  }