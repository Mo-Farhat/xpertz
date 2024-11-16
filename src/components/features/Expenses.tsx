import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import ExpenseTransactions from './Expenses/ExpenseTransactions';
import ExpenseAnalysis from '../../components/Reports/Finance/Expenses/ExpenseAnalysis';
import ExpenseBudget from './Expenses/ExpenseBudget';
import ExpenseApprovals from './Expenses/ExpenseApprovals';

const Expenses: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Expense Management</h2>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          <ExpenseTransactions />
        </TabsContent>

        <TabsContent value="approvals" className="mt-4">
          <ExpenseApprovals />
        </TabsContent>

        <TabsContent value="budget" className="mt-4">
          <ExpenseBudget />
        </TabsContent>

        <TabsContent value="analysis" className="mt-4">
          <ExpenseAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Expenses;