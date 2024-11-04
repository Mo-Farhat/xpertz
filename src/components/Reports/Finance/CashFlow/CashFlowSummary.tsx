import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { CashFlowData } from './types';
import { ArrowUpFromLine, ArrowDownToLine, DollarSign } from 'lucide-react';

interface CashFlowSummaryProps {
  data: CashFlowData;
}

const CashFlowSummary: React.FC<CashFlowSummaryProps> = ({ data }) => {
  const calculateOperatingCashFlow = () => {
    const { revenue, expenses, accountsReceivable, accountsPayable, inventory, otherOperating } = data.operating;
    return revenue - expenses + accountsPayable - accountsReceivable - inventory + otherOperating;
  };

  const calculateInvestingCashFlow = () => {
    const { assetPurchases, assetSales, investments, otherInvesting } = data.investing;
    return assetSales - assetPurchases + investments + otherInvesting;
  };

  const calculateFinancingCashFlow = () => {
    const { debtPayments, debtProceeds, equity, dividends, otherFinancing } = data.financing;
    return debtProceeds - debtPayments + equity - dividends + otherFinancing;
  };

  const netCashFlow = calculateOperatingCashFlow() + calculateInvestingCashFlow() + calculateFinancingCashFlow();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-4">
            <ArrowUpFromLine className="text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Operating Cash Flow</p>
              <p className="text-2xl font-bold">${calculateOperatingCashFlow().toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ArrowDownToLine className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Investing Cash Flow</p>
              <p className="text-2xl font-bold">${calculateInvestingCashFlow().toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DollarSign className="text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Financing Cash Flow</p>
              <p className="text-2xl font-bold">${calculateFinancingCashFlow().toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Net Cash Flow</span>
            <span className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netCashFlow.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowSummary;