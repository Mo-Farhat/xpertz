import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { PurchaseRequisition } from '../types';

interface PurchaseRequisitionListProps {
  requisitions: PurchaseRequisition[];
  onStatusUpdate: (id: string, newStatus: 'approved' | 'rejected') => Promise<void>;
}
const PurchaseRequisitionList: React.FC<PurchaseRequisitionListProps> = ({ 
  requisitions,
  onStatusUpdate
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Request #</TableHead>
          <TableHead>Requested By</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Date Required</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requisitions.map((req) => (
          <TableRow key={req.id}>
            <TableCell>{req.requestNumber}</TableCell>
            <TableCell>{req.requestedBy}</TableCell>
            <TableCell>{req.department}</TableCell>
            <TableCell>{req.dateRequired.toLocaleDateString()}</TableCell>
            <TableCell>${req.totalAmount.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={
                req.status === 'approved' ? 'default' :
                req.status === 'rejected' ? 'destructive' :
                req.status === 'pending' ? 'warning' :
                'secondary'
              }>
                {req.status}
              </Badge>
            </TableCell>
            <TableCell className="space-x-2">
              {req.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(req.id, 'approved')}
                    variant="default"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onStatusUpdate(req.id, 'rejected')}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default PurchaseRequisitionList;