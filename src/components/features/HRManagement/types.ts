export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    hireDate: Date;
    salary: number;
    status: 'active' | 'inactive' | 'on-leave';
    employmentType: 'full-time' | 'part-time' | 'contract';
    emergencyContact?: string;
    reportsTo?: string;
  }
  
  export interface PayrollRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    payPeriod: string;
    basicSalary: number;
    overtime: number;
    deductions: number;
    netSalary: number;
    paymentDate: Date;
    status: 'pending' | 'paid';
    taxDeductions?: number;
    benefits?: number;
    bonuses?: number;
    comments?: string;
  }
  
  export interface PayrollFormData extends Omit<PayrollRecord, 'id' | 'netSalary'> {
    netSalary?: number;
  }