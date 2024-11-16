import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { FinancialData } from '../../../services/financialReportingService';

interface FinancialMetricsProps {
  data: FinancialData;
  type: 'income' | 'balance' | 'cashflow';
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ data, type }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderMetrics = () => {
    switch (type) {
      case 'income':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Revenue" value={formatCurrency(data.revenue)} />
            <MetricCard title="Gross Profit" value={formatCurrency(data.grossProfit || 0)} />
            <MetricCard title="Operating Income" value={formatCurrency(data.operatingIncome || 0)} />
            <MetricCard title="Net Income" value={formatCurrency(data.netIncome || 0)} />
          </div>
        );
      case 'balance':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard title="Total Assets" value={formatCurrency(data.assets)} />
            <MetricCard title="Total Liabilities" value={formatCurrency(data.liabilities)} />
            <MetricCard 
              title="Total Equity" 
              value={formatCurrency(data.assets - data.liabilities)} 
            />
          </div>
        );
      case 'cashflow':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Operating Cash Flow" 
              value={formatCurrency(data.cashFromOperations)} 
            />
            <MetricCard 
              title="Investing Cash Flow" 
              value={formatCurrency(data.cashFromInvesting)} 
            />
            <MetricCard 
              title="Financing Cash Flow" 
              value={formatCurrency(data.cashFromFinancing)} 
            />
            <MetricCard 
              title="Net Cash Flow" 
              value={formatCurrency(data.netCashFlow)} 
            />
          </div>
        );
    }
  };

  return renderMetrics();
};

const MetricCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm text-gray-600">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default FinancialMetrics;