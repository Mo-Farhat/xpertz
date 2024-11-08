export interface LedgerEntry {
    id: string;
    date: Date;
    description: string;
    accountNumber: string;
    accountName: string;
    category: string;
    debit: number;
    credit: number;
    reference: string;
    status: 'pending' | 'completed' | 'reconciled';
    module: {
      type: string;
      id: string;
    };
  }
  
  export interface AccountSummary {
    accountNumber: string;
    accountName: string;
    totalDebits: number;
    totalCredits: number;
    balance: number;
  }
  
  export interface CategorySummary {
    category: string;
    totalDebits: number;
    totalCredits: number;
    balance: number;
    accounts: AccountSummary[];
  }
  
  export interface DateRange {
    from: Date;
    to: Date;
  }
  
  export interface LedgerFilters {
    dateRange: DateRange;
    modules?: string[];
    accounts?: string[];
    status?: string[];
  }