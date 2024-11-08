import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { fetchFinancialData, FinancialData } from '../../services/financialReportingService';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";

const FinancialReporting: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [financialData, setFinancialData] = useState<FinancialData>({
    revenue: 0,
    expenses: 0,
    assets: 0,
    liabilities: 0,
    cashFromOperations: 0,
    cashFromInvesting: 0,
    cashFromFinancing: 0,
    netCashFlow: 0
  });
  const [reportType, setReportType] = useState<'income' | 'balance' | 'cashflow'>('income');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const loadFinancialData = async () => {
      if (!user?.uid) return;

      try {
        const data = await fetchFinancialData(user.uid, startDate, endDate);
        setFinancialData(data);
      } catch (error) {
        console.error('Error loading financial data:', error);
        toast({
          title: "Error",
          description: "Failed to load financial data",
          variant: "destructive",
        });
      }
    };

    loadFinancialData();
  }, [user, reportType, startDate, endDate, toast]);

  const generateReport = () => {
    switch (reportType) {
      case 'income':
        return `Income Statement\n
Revenue: $${financialData.revenue.toFixed(2)}
Expenses: $${financialData.expenses.toFixed(2)}
Net Income: $${(financialData.revenue - financialData.expenses).toFixed(2)}`;

      case 'balance':
        return `Balance Sheet\n
Assets: $${financialData.assets.toFixed(2)}
Liabilities: $${financialData.liabilities.toFixed(2)}
Equity: $${(financialData.assets - financialData.liabilities).toFixed(2)}`;

      case 'cashflow':
        return `Cash Flow Statement\n
Cash from Operations: $${financialData.cashFromOperations.toFixed(2)}
Cash from Investing: $${financialData.cashFromInvesting.toFixed(2)}
Cash from Financing: $${financialData.cashFromFinancing.toFixed(2)}
Net Cash Flow: $${financialData.netCashFlow.toFixed(2)}`;
    }
  };

  const handleExport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportType}_report.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Financial Reporting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Select value={reportType} onValueChange={(value: 'income' | 'balance' | 'cashflow') => setReportType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income Statement</SelectItem>
                <SelectItem value="balance">Balance Sheet</SelectItem>
                <SelectItem value="cashflow">Cash Flow Statement</SelectItem>
              </SelectContent>
            </Select>
            
            <input
              type="date"
              value={startDate.toISOString().split('T')[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={endDate.toISOString().split('T')[0]}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="p-2 border rounded"
            />
            
            <Button
              onClick={handleExport}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

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
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReporting;