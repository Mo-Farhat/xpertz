import React from 'react';
import { DateRangePicker } from "../../../../components/ui/date-range-picker";
import { Card, CardContent } from "../../../../components/ui/card";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Label } from "../../../../components/ui/label";
import { type DateRange } from './types';

interface LedgerFiltersProps {
  filters: {
    dateRange: DateRange;
    modules?: string[];
    status?: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const MODULES = ['AP', 'AR', 'Payroll', 'Inventory', 'FixedAssets'];
const STATUSES = ['pending', 'completed', 'reconciled'];

const LedgerFilters: React.FC<LedgerFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleModuleChange = (module: string, checked: boolean) => {
    const newModules = checked
      ? [...(filters.modules || []), module]
      : (filters.modules || []).filter(m => m !== module);
    
    onFiltersChange({ ...filters, modules: newModules });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...(filters.status || []), status]
      : (filters.status || []).filter(s => s !== status);
    
    onFiltersChange({ ...filters, status: newStatuses });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <Label>Date Range</Label>
            <DateRangePicker
              value={filters.dateRange}
              onChange={(range) => onFiltersChange({ ...filters, dateRange: range })}
            />
          </div>

          <div>
            <Label>Modules</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {MODULES.map(module => (
                <div key={module} className="flex items-center space-x-2">
                  <Checkbox
                    id={`module-${module}`}
                    checked={filters.modules?.includes(module)}
                    onCheckedChange={(checked) => handleModuleChange(module, checked as boolean)}
                  />
                  <Label htmlFor={`module-${module}`}>{module}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {STATUSES.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.status?.includes(status)}
                    onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                  />
                  <Label htmlFor={`status-${status}`}>{status}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LedgerFilters;