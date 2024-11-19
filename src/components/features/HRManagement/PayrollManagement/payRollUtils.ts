import { PayrollRecord, PayrollFormData } from './types';

export const calculateNetSalary = (record: PayrollFormData): number => {
  const { basicSalary, overtime, deductions, bonuses = 0, benefits = 0, taxDeductions = 0 } = record;
  return basicSalary + overtime + bonuses + benefits - deductions - taxDeductions;
};

export const validatePayrollRecord = (record: PayrollFormData): string | null => {
  if (!record.employeeId || !record.employeeName) {
    return "Employee information is required";
  }

  if (!record.payPeriod) {
    return "Pay period is required";
  }

  if (record.basicSalary < 0 || record.overtime < 0 || record.deductions < 0) {
    return "Amounts cannot be negative";
  }

  if (!record.paymentDate) {
    return "Payment date is required";
  }

  return null;
};

export const calculateTaxDeductions = (basicSalary: number): number => {
  // Simple progressive tax calculation
  if (basicSalary <= 30000) {
    return basicSalary * 0.1;
  } else if (basicSalary <= 60000) {
    return 3000 + (basicSalary - 30000) * 0.2;
  } else {
    return 9000 + (basicSalary - 60000) * 0.3;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};