import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { ForecastData } from './types';

interface ForecastTableProps {
  data: ForecastData[];
}

const ForecastTable: React.FC<ForecastTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead className="text-right">Actual Sales</TableHead>
            <TableHead className="text-right">Forecasted Sales</TableHead>
            <TableHead className="text-right">Growth Rate</TableHead>
            <TableHead className="text-right">Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((forecast, index) => (
            <TableRow key={index}>
              <TableCell>{forecast.period}</TableCell>
              <TableCell className="text-right">
                ${forecast.actualSales.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                ${forecast.forecastedSales.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {(forecast.growthRate * 100).toFixed(1)}%
              </TableCell>
              <TableCell className="text-right">
                {forecast.confidence.toFixed(1)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ForecastTable;