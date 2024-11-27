import React from 'react';
import { Edit, Trash2, User, Phone, Mail } from 'lucide-react';
import { Button } from "../../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Customer } from './types';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {customer.name}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                {customer.email}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                {customer.phone}
              </div>
            </TableCell>
            <TableCell>{customer.company}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                customer.type === 'regular' ? 'bg-green-200 text-green-800' :
                customer.type === 'debt' ? 'bg-red-200 text-red-800' :
                customer.type === 'cheque' ? 'bg-blue-200 text-blue-800' :
                'bg-purple-200 text-purple-800'
              }`}>
                {customer.type}
              </span>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                customer.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
              }`}>
                {customer.status}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(customer)}
                className="mr-2"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(customer.id)}
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

export default CustomerTable;