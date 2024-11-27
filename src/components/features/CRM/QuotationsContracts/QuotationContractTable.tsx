import React from 'react';
import { FileText, DollarSign, Edit, Trash2, Printer } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { QuotationContract } from './types';

interface QuotationContractTableProps {
  documents: QuotationContract[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPrint: (document: QuotationContract) => void;
}

const QuotationContractTable: React.FC<QuotationContractTableProps> = ({
  documents,
  onEdit,
  onDelete,
  onPrint
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Valid Until</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                {doc.type}
              </div>
            </TableCell>
            <TableCell>{doc.customerName}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end">
                <DollarSign className="mr-2 h-4 w-4" />
                {doc.amount.toFixed(2)}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={
                doc.status === 'accepted' ? 'default' :
                doc.status === 'rejected' ? 'destructive' :
                doc.status === 'sent' ? 'secondary' :
                'outline'
              }>
                {doc.status}
              </Badge>
            </TableCell>
            <TableCell>{doc.validUntil.toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex justify-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPrint(doc)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Printer className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(doc.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(doc.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuotationContractTable;