import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import IncomeStatement from './Finance/IncomeStatement';
import BalanceSheet from './Finance/BalanceSheet/BalanceSheet';
import CashFlowStatement from './Finance/CashFlow/CashFlowStatement';
import SalesReport from './Finance/Sales/SalesReport';
import ExpenseAnalysis from './Finance/Expenses/ExpenseAnalysis';
import AgingReport from './Finance/Aging/AgingReport';
import BudgetComparison from './Finance/Budget/BudgetComparison';
import GeneralLedgerReport from './Finance/GeneralLedger/GeneralLedgerReport';
const FinanceReports = () => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="income" className="w-full">
        <TabsList>
          <TabsTrigger value="income">Income Statement</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="aging">Aging Report</TabsTrigger>
          <TabsTrigger value="budget">Budget vs. Actual</TabsTrigger>
          <TabsTrigger value="ledger">General Ledger</TabsTrigger>
        </TabsList>
        
        <TabsContent value="income">
          <IncomeStatement />
        </TabsContent>
        
        <TabsContent value="balance">
          <BalanceSheet />
        </TabsContent>
        <TabsContent value="cashflow">
          <CashFlowStatement />
        </TabsContent>
        <TabsContent value="sales">
          <SalesReport />
        </TabsContent>
        <TabsContent value="expenses">
          <ExpenseAnalysis />
        </TabsContent>
        <TabsContent value="aging">
          <AgingReport />
        </TabsContent>
        <TabsContent value="budget">
          <BudgetComparison />
        </TabsContent>
        <TabsContent value="ledger">
          <GeneralLedgerReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default FinanceReports;