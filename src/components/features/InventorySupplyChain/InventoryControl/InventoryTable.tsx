import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Edit, Trash2 } from 'lucide-react';
import { InventoryItem } from './types';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit, onDelete }) => {
  const getStatusBadge = (status: InventoryItem['status']) => {
    const variants = {
      'in-stock': 'bg-green-500',
      'low-stock': 'bg-yellow-500',
      'out-of-stock': 'bg-red-500'
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Reorder Point</TableHead>
          <TableHead className="text-right">Unit Cost</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.sku}</TableCell>
            <TableCell>{getStatusBadge(item.status)}</TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="text-right">{item.reorderPoint}</TableCell>
            <TableCell className="text-right">${item.unitCost.toFixed(2)}</TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.category || 'N/A'}</TableCell>
            <TableCell>{item.supplier || 'N/A'}</TableCell>
            <TableCell className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item.id)}
                className="mr-2"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InventoryTable;