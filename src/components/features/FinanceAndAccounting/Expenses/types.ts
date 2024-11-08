export interface Expense {
    id: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
  }