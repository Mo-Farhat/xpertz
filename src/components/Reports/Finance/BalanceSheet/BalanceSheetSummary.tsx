import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { BalanceSheetData } from './types';

interface BalanceSheetSummaryProps {
  data: BalanceSheetData;
}

const BalanceSheetSummary: React.FC<BalanceSheetSummaryProps> = ({ data }) => {
  const calculateTotalCurrentAssets = () => {
    const { cash, accountsReceivable, inventory, otherCurrentAssets } = data.assets.current;
    return cash + accountsReceivable + inventory + otherCurrentAssets;
  };

  const calculateTotalNonCurrentAssets = () => {
    const { propertyAndEquipment, intangibleAssets, investments, otherNonCurrentAssets } = data.assets.nonCurrent;
    return propertyAndEquipment + intangibleAssets + investments + otherNonCurrentAssets;
  };

  const calculateTotalCurrentLiabilities = () => {
    const { accountsPayable, shortTermDebt, otherCurrentLiabilities } = data.liabilities.current;
    return accountsPayable + shortTermDebt + otherCurrentLiabilities;
  };

  const calculateTotalNonCurrentLiabilities = () => {
    const { longTermDebt, otherNonCurrentLiabilities } = data.liabilities.nonCurrent;
    return longTermDebt + otherNonCurrentLiabilities;
  };

  const calculateTotalEquity = () => {
    const { commonStock, retainedEarnings, otherEquity } = data.equity;
    return commonStock + retainedEarnings + otherEquity;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Sheet Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Total Assets</h3>
            <p className="text-2xl font-bold">
              ${(calculateTotalCurrentAssets() + calculateTotalNonCurrentAssets()).toFixed(2)}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Total Liabilities</h3>
            <p className="text-2xl font-bold">
              ${(calculateTotalCurrentLiabilities() + calculateTotalNonCurrentLiabilities()).toFixed(2)}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Total Equity</h3>
            <p className="text-2xl font-bold">${calculateTotalEquity().toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceSheetSummary;