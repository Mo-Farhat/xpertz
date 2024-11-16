import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from "../../hooks/use-toast";
import { fetchFinancialData, FinancialData } from '../../services/financialReportingService';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import FinancialMetrics from './Reports/FinancialMetrics';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadFinancialData = async () => {
      if (!user?.uid) return;

      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    loadFinancialData();
  }, [user, reportType, startDate, endDate, toast]);

  const handleExport = () => {
    const reportContent = generateReportContent();
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}_report_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateReportContent = () => {
    const dateRange = `Report Period: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}\n\n`;
    
    switch (reportType) {
      case 'income':
        return `Income Statement\n${dateRange}
Revenue: $${financialData.revenue.toFixed(2)}
Gross Profit: $${(financialData.grossProfit || 0).toFixed(2)}
Operating Income: $${(financialData.operatingIncome || 0).toFixed(2)}
Net Income: $${(financialData.netIncome || 0).toFixed(2)}`;

      case 'balance':
        return `Balance Sheet\n${dateRange}
Assets: $${financialData.assets.toFixed(2)}
Liabilities: $${financialData.liabilities.toFixed(2)}
Equity: $${(financialData.assets - financialData.liabilities).toFixed(2)}`;

      case 'cashflow':
        return `Cash Flow Statement\n${dateRange}
Operating Cash Flow: $${financialData.cashFromOperations.toFixed(2)}
Investing Cash Flow: $${financialData.cashFromInvesting.toFixed(2)}
Financing Cash Flow: $${financialData.cashFromFinancing.toFixed(2)}
Net Cash Flow: $${financialData.netCashFlow.toFixed(2)}`;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Reporting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select 
              value={reportType} 
              onValueChange={(value: 'income' | 'balance' | 'cashflow') => setReportType(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income Statement</SelectItem>
                <SelectItem value="balance">Balance Sheet</SelectItem>
                <SelectItem value="cashflow">Cash Flow Statement</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-4">
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="border rounded px-3 py-2"
              />
              <input
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="border rounded px-3 py-2"
              />
            </div>

            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <FinancialMetrics data={financialData} type={reportType} />
              
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
                    {generateReportContent()}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReporting;