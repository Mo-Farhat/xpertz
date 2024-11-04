export interface ExpenseData {
    id: string;
    date: Date;
    category: string;
    amount: number;
    description: string;
    department: string;
  }
  
  export interface ExpenseSummary {
    totalExpenses: number;
    expensesByCategory: Record<string, number>;
    previousPeriodExpenses: Record<string, number>;
    percentageOfRevenue: Record<string, number>;
    changeFromPrevious: Record<string, {
      amount: number;
      percentage: number;
    }>;
  }