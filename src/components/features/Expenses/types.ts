export interface Expense {
    id: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedBy?: string;
    approvedBy?: string;
    approvedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    paymentMethod?: string;
    receipt?: string;
    notes?: string;
  }
  
  export interface ExpenseCategory {
    id: string;
    name: string;
    description?: string;
    budget?: number;
    isActive: boolean;
  }
  
  export interface ExpenseBudget {
    id: string;
    categoryId: string;
    amount: number;
    period: 'monthly' | 'quarterly' | 'yearly';
    startDate: Date;
    endDate: Date;
    actual: number;
    variance: number;
  }