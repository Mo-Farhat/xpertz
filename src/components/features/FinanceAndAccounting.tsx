import React, { useState } from 'react';
import GeneralLedger from './FinanceAndAccounting/GeneralLedger';
import AccountsPayable from './FinanceAndAccounting/AccountsPayable';
import AccountsReceivable from './FinanceAndAccounting/AccountsRecievable/AccountsReceivable';
import ExpenseManagement from './FinanceAndAccounting/ExpenseManagement';
import AssetManagement from './FinanceAndAccounting/AssetManagement';
import BankReconciliation from './FinanceAndAccounting/BankReconciliation';
import TaxManagement from './FinanceAndAccounting/TaxManagement';
import FinancialReporting from './FinanceAndAccounting/FinancialReporting';
import ChequeManagement from './FinanceAndAccounting/Cheques/ChequeManagement';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

const FinanceAndAccounting: React.FC = () => {
  const tabs = [
    { id: 'generalLedger', name: 'General Ledger', component: <GeneralLedger /> },
    { id: 'accountsPayable', name: 'Accounts Payable', component: <AccountsPayable /> },
    { id: 'accountsReceivable', name: 'Accounts Receivable', component: <AccountsReceivable /> },
    { id: 'expenseManagement', name: 'Expense Management', component: <ExpenseManagement /> },
    { id: 'assetManagement', name: 'Asset Management', component: <AssetManagement /> },
    { id: 'bankReconciliation', name: 'Bank Reconciliation', component: <BankReconciliation /> },
    { id: 'chequeManagement', name: 'Cheque Management', component: <ChequeManagement /> },
    { id: 'taxManagement', name: 'Tax Management', component: <TaxManagement /> },
    { id: 'financialReporting', name: 'Financial Reporting', component: <FinancialReporting /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Finance & Accounting
      </h2>

      {/* Tabs Container */}
      <Tabs defaultValue="generalLedger">
        {/* Tabs List */}
        <TabsList
          className="flex flex-wrap items-center justify-center gap-4 sticky top-0 z-50 bg-white p-4 shadow-md rounded-lg mb-6"
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="px-6 py-3 text-base font-medium rounded-lg transition-all duration-300 
                bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white hover:opacity-90 
                shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tabs Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="fade-in">
              {tab.component}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default FinanceAndAccounting;