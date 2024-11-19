import React from 'react';
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { useToast } from "../../hooks/use-toast";
import { useForecastOperations } from './Forecasting/useForecastOperations';
import ForecastHeader from './Forecasting/ForecastHeader';
import ForecastMetrics from './Forecasting/ForecastMetrics';
import ForecastForm from './Forecasting/ForecastForm';
import ForecastTable from './Forecasting/ForecastTable';

const DemandForecasting: React.FC = () => {
  const { toast } = useToast();
  const {
    forecasts,
    newForecast,
    setNewForecast,
    editingId,
    setEditingId,
    handleAddForecast,
    handleUpdateForecast,
    handleDeleteForecast,
    handleAutoGenerate,
    handleExport
  } = useForecastOperations();

  return (
    <Card>
      <CardHeader>
        <ForecastHeader 
          onAutoGenerate={handleAutoGenerate}
          onExport={handleExport}
        />
      </CardHeader>
      <CardContent>
        <ForecastMetrics forecasts={forecasts} />
        <ForecastForm
          forecast={newForecast}
          onSubmit={handleAddForecast}
          onChange={setNewForecast}
        />
        <ForecastTable
          forecasts={forecasts}
          onEdit={setEditingId}
          onDelete={handleDeleteForecast}
        />
      </CardContent>
    </Card>
  );
};

export default DemandForecasting;