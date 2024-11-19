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