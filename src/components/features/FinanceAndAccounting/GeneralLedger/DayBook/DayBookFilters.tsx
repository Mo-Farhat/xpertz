import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { DateRangePicker } from "../../../../../components/ui/date-range-picker";
import { DateRange } from 'react-day-picker';

interface DayBookFiltersProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  transactionType: string;
  onTransactionTypeChange: (type: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

const DayBookFilters: React.FC<DayBookFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  transactionType,
  onTransactionTypeChange,
  status,
  onStatusChange
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <DateRangePicker
        value={dateRange}
        onChange={onDateRangeChange}
      />
      
      <Select value={transactionType} onValueChange={onTransactionTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Transaction Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="sale">Sales</SelectItem>
          <SelectItem value="purchase">Purchases</SelectItem>
          <SelectItem value="payment">Payments</SelectItem>
          <SelectItem value="receipt">Receipts</SelectItem>
          <SelectItem value="journal">Journal</SelectItem>
          <SelectItem value="manual">Manual</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="posted">Posted</SelectItem>
          <SelectItem value="voided">Voided</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DayBookFilters;