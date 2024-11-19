import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import { ForecastItem } from './types';
interface ForecastTableProps {
  forecasts: ForecastItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
const ForecastTable: React.FC<ForecastTableProps> = ({ forecasts, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item ID</TableHead>
          <TableHead>Item Name</TableHead>
          <TableHead>Forecast Date</TableHead>
          <TableHead className="text-right">Predicted Demand</TableHead>
          <TableHead className="text-right">Actual Demand</TableHead>
          <TableHead className="text-right">Accuracy</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forecasts.map((forecast) => (
          <TableRow key={forecast.id}>
            <TableCell>{forecast.itemId}</TableCell>
            <TableCell>{forecast.itemName}</TableCell>
            <TableCell>{forecast.forecastDate.toLocaleDateString()}</TableCell>
            <TableCell className="text-right">{forecast.predictedDemand}</TableCell>
            <TableCell className="text-right">{forecast.actualDemand || 'N/A'}</TableCell>
            <TableCell className="text-right">
              {forecast.accuracy ? `${forecast.accuracy.toFixed(2)}%` : 'N/A'}
            </TableCell>
            <TableCell className="text-center">
              <Button variant="ghost" size="sm" onClick={() => onEdit(forecast.id)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(forecast.id)} className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default ForecastTable;