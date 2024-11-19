import { Employee, PayrollRecord } from '../types';

export const calculatePayrollComponents = (employee: Employee, overtime: number = 0, bonuses: number = 0) => {
  const basicSalary = employee.salary;
  const overtimeRate = basicSalary / 160; // Assuming 160 working hours per month
  const overtimePay = overtime * (overtimeRate * 1.5); // 1.5x overtime rate
  
  // Tax brackets (simplified progressive tax)
  const calculateTax = (amount: number) => {
    if (amount <= 2500) return amount * 0.1;
    if (amount <= 5000) return 250 + (amount - 2500) * 0.15;
    return 625 + (amount - 5000) * 0.25;
  };

  // Benefits calculation (simplified)
  const benefits = basicSalary * 0.12; // 12% benefits package
  const taxableIncome = basicSalary + overtimePay + bonuses;
  const taxes = calculateTax(taxableIncome);
  
  // Social security and other deductions (simplified)
  const socialSecurity = basicSalary * 0.045; // 4.5% social security
  const healthInsurance = basicSalary * 0.015; // 1.5% health insurance
  const totalDeductions = taxes + socialSecurity + healthInsurance;

  const netSalary = taxableIncome + benefits - totalDeductions;

  return {
    basicSalary,
    overtimePay,
    benefits,
    taxes,
    deductions: totalDeductions,
    netSalary,
    socialSecurity,
    healthInsurance,
    taxableIncome
  };
};