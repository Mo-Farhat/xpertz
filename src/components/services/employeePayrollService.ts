import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Employee, PayrollRecord } from '../features/HRManagement/types'

export const generatePayrollRecord = async (
  employee: Employee,
  payPeriod: string,
  overtime: number = 0,
  bonuses: number = 0
): Promise<void> => {
  const basicSalary = employee.salary;
  const taxRate = 0.2; // 20% tax rate
  const benefitsRate = 0.1; // 10% benefits
  const overtimeRate = (basicSalary / 160) * 1.5; // Assuming 160 working hours per month, 1.5x overtime rate
  
  const overtimePay = overtime * overtimeRate;
  const benefits = basicSalary * benefitsRate;
  const taxableIncome = basicSalary + overtimePay + bonuses;
  const taxDeductions = taxableIncome * taxRate;
  const netSalary = taxableIncome + benefits - taxDeductions;

  const payrollRecord = {
    employeeId: employee.id,
    employeeName: `${employee.firstName} ${employee.lastName}`,
    payPeriod,
    basicSalary,
    overtime: overtimePay,
    deductions: taxDeductions,
    netSalary,
    paymentDate: Timestamp.fromDate(new Date()),
    status: 'pending',
    taxDeductions,
    benefits,
    bonuses,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  await addDoc(collection(db, 'payroll'), payrollRecord);
};