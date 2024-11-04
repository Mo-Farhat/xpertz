import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useTenant } from '../../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { BalanceSheetData } from './types';
import BalanceSheetSummary from './BalanceSheetSummary';

const BalanceSheet = () => {
  const { tenant } = useTenant();
  const [asOfDate, setAsOfDate] = useState<Date>(new Date());
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheetData>({
    assets: {
      current: { cash: 0, accountsReceivable: 0, inventory: 0, otherCurrentAssets: 0 },
      nonCurrent: { propertyAndEquipment: 0, intangibleAssets: 0, investments: 0, otherNonCurrentAssets: 0 }
    },
    liabilities: {
      current: { accountsPayable: 0, shortTermDebt: 0, otherCurrentLiabilities: 0 },
      nonCurrent: { longTermDebt: 0, otherNonCurrentLiabilities: 0 }
    },
    equity: { commonStock: 0, retainedEarnings: 0, otherEquity: 0 }
  });

  useEffect(() => {
    const fetchBalanceSheetData = async () => {
      if (!tenant) return;

      const balanceSheetQuery = query(
        collection(db, `tenants/${tenant.id}/balanceSheet`),
        where('date', '<=', Timestamp.fromDate(asOfDate))
      );

      const snapshot = await getDocs(balanceSheetQuery);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data() as BalanceSheetData;
        setBalanceSheetData(data);
      }
    };

    fetchBalanceSheetData();
  }, [tenant, asOfDate]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Balance Sheet</h3>
        <Select 
          value={asOfDate.toISOString().split('T')[0]} 
          onValueChange={(value) => setAsOfDate(new Date(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date" />
          </SelectTrigger>
          <SelectContent>
            {/* Add date options */}
            <SelectItem value={new Date().toISOString().split('T')[0]}>Today</SelectItem>
            <SelectItem value={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}>Last Week</SelectItem>
            <SelectItem value={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}>Last Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <BalanceSheetSummary data={balanceSheetData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Current Assets</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cash</span>
                    <span>${balanceSheetData.assets.current.cash.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accounts Receivable</span>
                    <span>${balanceSheetData.assets.current.accountsReceivable.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inventory</span>
                    <span>${balanceSheetData.assets.current.inventory.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Current Assets</span>
                    <span>${balanceSheetData.assets.current.otherCurrentAssets.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Non-Current Assets</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Property and Equipment</span>
                    <span>${balanceSheetData.assets.nonCurrent.propertyAndEquipment.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Intangible Assets</span>
                    <span>${balanceSheetData.assets.nonCurrent.intangibleAssets.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investments</span>
                    <span>${balanceSheetData.assets.nonCurrent.investments.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Non-Current Assets</span>
                    <span>${balanceSheetData.assets.nonCurrent.otherNonCurrentAssets.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Current Liabilities</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Accounts Payable</span>
                      <span>${balanceSheetData.liabilities.current.accountsPayable.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Short-term Debt</span>
                      <span>${balanceSheetData.liabilities.current.shortTermDebt.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Current Liabilities</span>
                      <span>${balanceSheetData.liabilities.current.otherCurrentLiabilities.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Non-Current Liabilities</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Long-term Debt</span>
                      <span>${balanceSheetData.liabilities.nonCurrent.longTermDebt.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Non-Current Liabilities</span>
                      <span>${balanceSheetData.liabilities.nonCurrent.otherNonCurrentLiabilities.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Common Stock</span>
                  <span>${balanceSheetData.equity.commonStock.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Retained Earnings</span>
                  <span>${balanceSheetData.equity.retainedEarnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Other Equity</span>
                  <span>${balanceSheetData.equity.otherEquity.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;