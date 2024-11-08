export interface TaxRecord {
    id: string;
    taxYear: number;
    taxType: string;
    amount: number;
    dueDate: Date;
    status: 'pending' | 'paid' | 'overdue';
    region: string;
  }