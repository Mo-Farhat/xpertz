import React from 'react';
import { Button } from "../../../../components/ui/button";
import { Download } from 'lucide-react';

interface ExportEmployeesButtonProps {
  employees: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    hireDate: Date;
    salary: number;
    status: string;
    employmentType: string;
  }>;
}

const ExportEmployeesButton: React.FC<ExportEmployeesButtonProps> = ({ employees }) => {
  const handleExport = () => {
    const csvContent = [
      ['First Name', 'Last Name', 'Email', 'Phone', 'Position', 'Department', 'Hire Date', 'Salary', 'Status', 'Employment Type'].join(','),
      ...employees.map(emp => 
        [
          emp.firstName,
          emp.lastName,
          emp.email,
          emp.phone,
          emp.position,
          emp.department,
          emp.hireDate.toISOString(),
          emp.salary,
          emp.status,
          emp.employmentType
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'employees.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
};

export default ExportEmployeesButton;