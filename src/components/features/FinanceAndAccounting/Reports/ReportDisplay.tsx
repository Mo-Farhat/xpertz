import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { FinancialData } from '../../../services/financialReportingService';

interface ReportDisplayProps {
  reportType: 'income' | 'balance' | 'cashflow';
  data: FinancialData;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ reportType, data }) => {
  const generateReport = () => {
    switch (reportType) {
      case 'income':
        return `Income Statement\n
Revenue: $${data.revenue.toFixed(2)}
Expenses: $${data.expenses.toFixed(2)}
Net Income: $${(data.revenue - data.expenses).toFixed(2)}`;

      case 'balance':
        return `Balance Sheet\n
Assets: $${data.assets.toFixed(2)}
Liabilities: $${data.liabilities.toFixed(2)}
Equity: $${(data.assets - data.liabilities).toFixed(2)}`;

      case 'cashflow':
        return `Cash Flow Statement\n
Cash from Operations: $${data.cashFromOperations.toFixed(2)}
Cash from Investing: $${data.cashFromInvesting.toFixed(2)}
Cash from Financing: $${data.cashFromFinancing.toFixed(2)}
Net Cash Flow: $${data.netCashFlow.toFixed(2)}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {reportType === 'income' ? 'Income Statement' :
           reportType === 'balance' ? 'Balance Sheet' :
           'Cash Flow Statement'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
          {generateReport()}
        </pre>
      </CardContent>
    </Card>
  );
};

export default ReportDisplay;