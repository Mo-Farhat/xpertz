export interface LedgerEntry {
    id: string;
    date: Date;
    accountName: string;
    accountNumber: string;
    accountCategory: 'Assets' | 'Liabilities' | 'Revenue' | 'Expenses';
    description: string;
    debit: number;
    credit: number;
  }
  export interface AccountSummary {
    accountName: string;
    accountNumber: string;
    accountCategory: string;
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