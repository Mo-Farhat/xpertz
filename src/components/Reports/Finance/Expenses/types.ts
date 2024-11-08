export interface ExpenseAnalysisData {
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  previousPeriodExpenses: Record<string, number>;
  changeFromPrevious: Record<string, {
    amount: number;
    percentage: number;
  }>;
  monthlyTrends: Record<string, number>;
}

export interface ExpenseSummaryProps {
  data: ExpenseAnalysisData;
}