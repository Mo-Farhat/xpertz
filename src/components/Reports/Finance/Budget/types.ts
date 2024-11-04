export interface BudgetItem {
    category: string;
    budgeted: number;
    actual: number;
    variance: number;
    variancePercentage: number;
  }
  
  export interface BudgetData {
    income: BudgetItem[];
    expenses: BudgetItem[];
    summary: {
      totalBudgetedIncome: number;
      totalActualIncome: number;
      totalBudgetedExpenses: number;
      totalActualExpenses: number;
      netBudgetedIncome: number;
      netActualIncome: number;
    };
  }