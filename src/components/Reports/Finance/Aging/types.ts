export interface AgingBracket {
    range: string;
    amount: number;
    percentage: number;
  }
  
  export interface AccountEntry {
    id: string;
    name: string;
    total: number;
    brackets: AgingBracket[];
    lastPaymentDate: Date;
    status: 'current' | 'overdue';
  }
  
  export interface AgingData {
    receivables: {
      total: number;
      brackets: Record<string, number>;
      accounts: AccountEntry[];
    };
    payables: {
      total: number;
      brackets: Record<string, number>;
      accounts: AccountEntry[];
    };
  }