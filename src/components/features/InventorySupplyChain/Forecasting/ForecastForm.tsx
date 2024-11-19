import React from 'react';
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Plus } from 'lucide-react';
import { ForecastFormProps } from './types';

const ForecastForm: React.FC<ForecastFormProps> = ({ forecast, onSubmit, onChange }) => {
  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="Item ID"
          value={forecast.itemId}
          onChange={(e) => onChange({ ...forecast, itemId: e.target.value })}
          className="p-2 border rounded"
        />
        <Input
          type="text"
          placeholder="Item Name"
          value={forecast.itemName}
          onChange={(e) => onChange({ ...forecast, itemName: e.target.value })}
          className="p-2 border rounded"
        />
        <Input
          type="date"
          value={forecast.forecastDate.toISOString().split('T')[0]}
          onChange={(e) => onChange({ ...forecast, forecastDate: new Date(e.target.value) })}
          className="p-2 border rounded"
        />
        <Input
          type="number"
          placeholder="Predicted Demand"
          value={forecast.predictedDemand}
          onChange={(e) => onChange({ ...forecast, predictedDemand: parseInt(e.target.value) })}
          className="p-2 border rounded"
        />
      </div>
      <Button type="submit" className="mt-4 w-full flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" /> Add Forecast
      </Button>
    </form>
  );
};

export default ForecastForm;