import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Employee } from '../types';

interface EmployeeTableProps {
  employees: Employee[];
  editingId: string | null;
  onEdit: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Employee>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  editingId,
  onEdit,
  onUpdate,
  onDelete
}) => {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Phone</th>
            <th className="py-3 px-6 text-left">Position</th>
            <th className="py-3 px-6 text-left">Department</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-right">Salary</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b">
              <td className="py-3 px-6 text-left">
                {employee.firstName} {employee.lastName}
              </td>
              <td className="py-3 px-6 text-left">{employee.email}</td>
              <td className="py-3 px-6 text-left">{employee.phone}</td>
              <td className="py-3 px-6 text-left">{employee.position}</td>
              <td className="py-3 px-6 text-left">{employee.department}</td>
              <td className="py-3 px-6 text-left">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                  ${employee.status === 'active' ? 'bg-green-100 text-green-800' :
                    employee.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                  {employee.status}
                </span>
              </td>
              <td className="py-3 px-6 text-left">{employee.employmentType}</td>
              <td className="py-3 px-6 text-right">${employee.salary.toFixed(2)}</td>
              <td className="py-3 px-6 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(employee.id)}
                  className="mr-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(employee.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;