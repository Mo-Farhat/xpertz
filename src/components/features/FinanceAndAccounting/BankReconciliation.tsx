import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import BankTransactions from './Banking/BankTransactions';
import BankingReports from './Banking/BankingReports';

const BankReconciliation = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Bank Reconciliation</h2>
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <BankTransactions />
        </TabsContent>
        
        <TabsContent value="reports">
          <BankingReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BankReconciliation;