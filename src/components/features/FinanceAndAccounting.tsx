import React from 'react';
import { Book, DollarSign, CreditCard, FileText, BarChart2, Briefcase, Percent, PieChart, CheckSquare } from 'lucide-react';
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
    { id: 'generalLedger', name: 'General Ledger', icon: <Book />, component: <GeneralLedger /> },
    { id: 'accountsPayable', name: 'Accounts Payable', icon: <CreditCard />, component: <AccountsPayable /> },
    { id: 'accountsReceivable', name: 'Accounts Receivable', icon: <DollarSign />, component: <AccountsReceivable /> },
    { id: 'expenseManagement', name: 'Expense Management', icon: <FileText />, component: <ExpenseManagement /> },
    { id: 'assetManagement', name: 'Asset Management', icon: <Briefcase />, component: <AssetManagement /> },
    { id: 'bankReconciliation', name: 'Bank Reconciliation', icon: <BarChart2 />, component: <BankReconciliation /> },
    { id: 'chequeManagement', name: 'Cheque Management', icon: <CheckSquare />, component: <ChequeManagement /> },
    { id: 'taxManagement', name: 'Tax Management', icon: <Percent />, component: <TaxManagement /> },
    { id: 'financialReporting', name: 'Financial Reporting', icon: <PieChart />, component: <FinancialReporting /> },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Finance & Accounting</h2>
      <Tabs defaultValue="generalLedger">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex flex-col items-center justify-center p-4 rounded-lg"
            >
              <div className="text-3xl mb-2">{tab.icon}</div>
              <span className="text-sm text-center">{tab.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="bg-white rounded-lg shadow p-6">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FinanceAndAccounting;
