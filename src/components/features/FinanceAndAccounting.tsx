import React, { useState, useEffect } from 'react';
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

const FinanceAndAccounting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generalLedger');

  const tabs = [
    { id: 'generalLedger', name: 'General Ledger', icon: <Book /> },
    { id: 'accountsPayable', name: 'Accounts Payable', icon: <CreditCard /> },
    { id: 'accountsReceivable', name: 'Accounts Receivable', icon: <DollarSign /> },
    { id: 'expenseManagement', name: 'Expense Management', icon: <FileText /> },
    { id: 'assetManagement', name: 'Asset Management', icon: <Briefcase /> },
    { id: 'bankReconciliation', name: 'Bank Reconciliation', icon: <BarChart2 /> },
    { id: 'chequeManagement', name: 'Cheque Management', icon: <CheckSquare /> },
    { id: 'taxManagement', name: 'Tax Management', icon: <Percent /> },
    { id: 'financialReporting', name: 'Financial Reporting', icon: <PieChart /> },
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case 'generalLedger':
        return <GeneralLedger />;
      case 'accountsPayable':
        return <AccountsPayable />;
      case 'accountsReceivable':
        return <AccountsReceivable />;
      case 'expenseManagement':
        return <ExpenseManagement />;
      case 'assetManagement':
        return <AssetManagement />;
      case 'bankReconciliation':
        return <BankReconciliation />;
      case 'chequeManagement':
        return <ChequeManagement />;
      case 'taxManagement':
        return <TaxManagement />;
      case 'financialReporting':
        return <FinancialReporting />;
      default:
        return <GeneralLedger />;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Finance & Accounting</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="text-3xl mb-2">{tab.icon}</div>
            <span className="text-sm text-center">{tab.name}</span>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {renderComponent()}
      </div>
    </div>
  );
};

export default FinanceAndAccounting;