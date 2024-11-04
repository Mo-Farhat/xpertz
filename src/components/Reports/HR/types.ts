export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  hireDate: Date;
  status: 'active' | 'inactive' | 'on-leave';
  emergencyContact?: string;
  reportsTo?: string;
}

export interface Position {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  department: string;
}

export interface PayrollData {
  totalPayroll: number;
  departmentBreakdown: Record<string, number>;
  employeeCount: number;
  averageSalary: number;
  benefits: number;
  taxes: number;
  overtime: number;
  bonuses: number;
}