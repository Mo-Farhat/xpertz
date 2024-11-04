import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Download } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Employee } from './types';
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeTable from './components/EmployeeTable';

// Temporary mock data for demonstration
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    department: 'Engineering',
    position: 'Senior Developer',
    employmentType: 'full-time',
    hireDate: new Date('2023-01-15'),
    status: 'active',
    emergencyContact: 'Jane Doe: 123-456-7890',
    reportsTo: 'Sarah Manager'
  },
  // Add more mock employees as needed
];

const EmployeeInfoReport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const departments = [...new Set(mockEmployees.map(emp => emp.department))];
  const statuses = ['active', 'inactive', 'on-leave'];

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Department', 'Position', 'Employment Type', 'Hire Date', 'Status', 'Emergency Contact', 'Reports To'],
      ...filteredEmployees.map(emp => [
        emp.name,
        emp.email,
        emp.phone,
        emp.department,
        emp.position,
        emp.employmentType,
        emp.hireDate.toLocaleDateString(),
        emp.status,
        emp.emergencyContact || 'N/A',
        emp.reportsTo || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `employee_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Report Downloaded",
      description: "The employee report has been downloaded successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Employee Information Report</CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete overview of all employees and their current status
            </p>
          </div>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <EmployeeFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            departments={departments}
            statuses={statuses}
          />
          <EmployeeTable employees={filteredEmployees} />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeInfoReport;