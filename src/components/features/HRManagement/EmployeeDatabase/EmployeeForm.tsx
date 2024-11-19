import React from 'react';
import { Employee } from '../types';
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Plus } from 'lucide-react';

interface EmployeeFormProps {
  employee: Omit<Employee, 'id'>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (employee: Omit<Employee, 'id'>) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onChange }) => {
  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="First Name"
          value={employee.firstName}
          onChange={(e) => onChange({ ...employee, firstName: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={employee.lastName}
          onChange={(e) => onChange({ ...employee, lastName: e.target.value })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={employee.email}
          onChange={(e) => onChange({ ...employee, email: e.target.value })}
        />
        <Input
          type="tel"
          placeholder="Phone"
          value={employee.phone}
          onChange={(e) => onChange({ ...employee, phone: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Position"
          value={employee.position}
          onChange={(e) => onChange({ ...employee, position: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Department"
          value={employee.department}
          onChange={(e) => onChange({ ...employee, department: e.target.value })}
        />
        <Input
          type="date"
          value={employee.hireDate.toISOString().split('T')[0]}
          onChange={(e) => onChange({ ...employee, hireDate: new Date(e.target.value) })}
        />
        <Input
          type="number"
          placeholder="Salary"
          value={employee.salary}
          onChange={(e) => onChange({ ...employee, salary: parseFloat(e.target.value) })}
        />
      </div>
      <Button type="submit" className="mt-4">
        <Plus className="mr-2 h-4 w-4" /> Add Employee
      </Button>
    </form>
  );
};

export default EmployeeForm;