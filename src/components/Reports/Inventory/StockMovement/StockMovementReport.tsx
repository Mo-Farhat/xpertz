import React from 'react';
import { Card } from '../../../../components/ui/card';
import MovementMetrics from './MovementMetrics';
import MovementChart from './MovementChart';
import MovementFilters from './MovementFilters';
import { useStockMovement } from './useStockMovement';

const StockMovementReport = () => {
  const { 
    movements,
    dateRange,
    movementType,
    setDateRange,
    setMovementType,
    metrics,
    chartData
  } = useStockMovement();

  return (
    <div className="space-y-6">
      <MovementFilters 
        dateRange={dateRange}
        movementType={movementType}
        onDateRangeChange={setDateRange}
        onMovementTypeChange={setMovementType}
      />
      <MovementMetrics metrics={metrics} />
      <Card className="p-6">
        <MovementChart data={chartData} />
      </Card>
    </div>
  );
};

export default StockMovementReport;