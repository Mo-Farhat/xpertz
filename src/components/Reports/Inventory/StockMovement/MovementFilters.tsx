import React from 'react';
import { DateRangePicker } from '../../../../components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { DateRange } from 'react-day-picker';

interface MovementFiltersProps {
  dateRange: DateRange;
  movementType: 'all' | 'inbound' | 'outbound';
  onDateRangeChange: (range: DateRange) => void;
  onMovementTypeChange: (value: 'all' | 'inbound' | 'outbound') => void;
}

const MovementFilters: React.FC<MovementFiltersProps> = ({
  dateRange,
  movementType,
  onDateRangeChange,
  onMovementTypeChange,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Stock Movement Analysis</h2>
      <div className="flex gap-4">
        <DateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
        />
        <Select value={movementType} onValueChange={onMovementTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Movement type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Movements</SelectItem>
            <SelectItem value="inbound">Inbound Only</SelectItem>
            <SelectItem value="outbound">Outbound Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MovementFilters;