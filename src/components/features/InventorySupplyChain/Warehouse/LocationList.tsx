import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { Progress } from "../../../../components/ui/progress";
import { WarehouseLocation } from './types';

interface LocationListProps {
  locations: WarehouseLocation[];
  onEdit: (location: WarehouseLocation) => void;
  onDelete: (id: string) => void;
}

const LocationList = ({ locations, onEdit, onDelete }: LocationListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Zone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Capacity Usage</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {locations.map((location) => {
          const usagePercentage = (location.currentOccupancy / location.capacity) * 100;
          
          return (
            <TableRow key={location.id}>
              <TableCell className="font-medium">{location.name}</TableCell>
              <TableCell className="capitalize">{location.type}</TableCell>
              <TableCell>{location.zone || '-'}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${location.status === 'active' ? 'bg-green-100 text-green-800' :
                    location.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    location.status === 'full' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                  {location.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="w-full">
                  <Progress value={usagePercentage} className="h-2" />
                  <span className="text-xs text-gray-500 mt-1">
                    {location.currentOccupancy} / {location.capacity} ({usagePercentage.toFixed(1)}%)
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(location)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(location.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default LocationList;