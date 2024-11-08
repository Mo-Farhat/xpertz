export interface ARInvoice {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  issueDate: Date;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  createdAt: Date;
  updatedAt?: Date;
  description?: string;
  terms?: string;
  notes?: string;
  taxAmount?: number;
  taxRate?: number;
  subtotal: number;
  totalAmount: number;
  currency: string;
  paymentTerms?: string;
  category?: string;
  department?: string;
  reference?: string;
}

// Type alias for backward compatibility
export type Invoice = ARInvoice;

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: Date;
  method: 'cash' | 'bank_transfer' | 'check' | 'credit_card' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference?: string;
  notes?: string;
  processedBy?: string;
  transactionId?: string;
}

export interface CustomerBalance {
  customerId: string;
  customerName: string;
  totalBalance: number;
  current: number;
  thirtyDays: number;
  sixtyDays: number;
  ninetyDays: number;
  overNinetyDays: number;
  lastPaymentDate?: Date;
  lastPaymentAmount?: number;
  creditLimit?: number;
  paymentHistory?: Payment[];
}

// Aging Analysis Types
export interface AgingBucket {
  range: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface AgingAnalysis {
  current: AgingBucket;
  thirtyDays: AgingBucket;
  sixtyDays: AgingBucket;
  ninetyDays: AgingBucket;
  overNinetyDays: AgingBucket;
  total: number;
}

// Collection Metrics
export interface CollectionMetrics {
  totalReceivables: number;
  totalOverdue: number;
  averageDaysToPayment: number;
  collectionRate: number;
  badDebtPercentage: number;
  totalCustomers: number;
  activeCustomers: number;
}

// Report Types
export interface ARReport {
  periodStart: Date;
  periodEnd: Date;
  metrics: CollectionMetrics;
  agingAnalysis: AgingAnalysis;
  topCustomers: CustomerBalance[];
  paymentTrends: PaymentTrend[];
  riskAnalysis: RiskAnalysis;
}

export interface PaymentTrend {
  period: Date;
  totalCollected: number;
  totalInvoiced: number;
  collectionRate: number;
  averageDaysToPayment: number;
}

export interface RiskAnalysis {
  highRiskCustomers: number;
  mediumRiskCustomers: number;
  lowRiskCustomers: number;
  totalAtRisk: number;
  riskByAmount: {
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
  };
}

// Dashboard Types
export interface ARDashboardMetrics {
  totalReceivables: number;
  overdueReceivables: number;
  pendingInvoices: number;
  overduePercentage: number;
  averageCollectionPeriod: number;
  currentCollectionRate: number;
}

export interface CustomerSummary {
  id: string;
  name: string;
  totalOwed: number;
  status: 'good' | 'warning' | 'risk';
  lastPaymentDate?: Date;
  paymentHistory: Payment[];
}

// Filter and Sort Types
export interface ARFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: ARInvoice['status'][];
  customerIds?: string[];
  minAmount?: number;
  maxAmount?: number;
  categories?: string[];
}

export interface ARSortOptions {
  field: keyof ARInvoice | 'customerBalance';
  direction: 'asc' | 'desc';
}

// Export Types
export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel';
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeDetails: boolean;
  includeSummary: boolean;
}

