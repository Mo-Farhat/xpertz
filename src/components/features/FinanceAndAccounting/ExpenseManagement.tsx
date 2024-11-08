import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import ExpenseTransactions from './Expenses/ExpenseTransactions';
import ExpenseAnalysis from '../../Reports/Finance/Expenses/ExpenseAnalysis';

const ExpenseManagement = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Expense Management</h2>
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <ExpenseTransactions />
        </TabsContent>
        
        <TabsContent value="reports">
          <ExpenseAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseManagement