import React from 'react';
import { Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Button } from "../../../../components/ui/button";

interface ReportFiltersProps {
  reportType: 'income' | 'balance' | 'cashflow';
  startDate: Date;
  endDate: Date;
  onReportTypeChange: (value: 'income' | 'balance' | 'cashflow') => void;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onExport: () => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  reportType,
  startDate,
  endDate,
  onReportTypeChange,
  onStartDateChange,
  onEndDateChange,
  onExport
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <Select value={reportType} onValueChange={onReportTypeChange}>
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
        onChange={(e) => onStartDateChange(new Date(e.target.value))}
        className="p-2 border rounded"
      />
      <input
        type="date"
        value={endDate.toISOString().split('T')[0]}
        onChange={(e) => onEndDateChange(new Date(e.target.value))}
        className="p-2 border rounded"
      />
      
      <Button
        onClick={onExport}
        className="flex items-center gap-2"
        variant="outline"
      >
        <Download className="h-4 w-4" />
        Export Report
      </Button>
    </div>
  );
};

export default ReportFilters;