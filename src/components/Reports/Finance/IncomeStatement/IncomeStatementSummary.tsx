
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { FinancialData } from '../../../services/reports/incomeStatementService';

interface IncomeStatementSummaryProps {
  data: FinancialData;
}

const IncomeStatementSummary: React.FC<IncomeStatementSummaryProps> = ({ data }) => {
  const calculateNetProfit = () => {
    const grossProfit = data.revenue - data.costOfGoodsSold;
    return grossProfit - data.operatingExpenses;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">${data.revenue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cost of Goods Sold</p>
              <p className="text-2xl font-bold">${data.costOfGoodsSold.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Operating Expenses</p>
              <p className="text-2xl font-bold">${data.operatingExpenses.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Net Profit</p>
              <p className="text-2xl font-bold">${calculateNetProfit().toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeStatementSummary;