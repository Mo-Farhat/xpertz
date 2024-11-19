import { collection, addDoc, query, where, getDocs, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Employee, PayrollRecord } from '../types';
import { calculatePayrollComponents } from './PayrollCalculator';

export const generatePayrollRecord = async (
  employee: Employee,
  payPeriod: string,
  overtime: number = 0,
  bonuses: number = 0,
  deductions: number = 0
): Promise<PayrollRecord> => {
  const components = calculatePayrollComponents(employee, overtime, bonuses);
  
  // Validate if payroll already exists for this period
  const existingPayroll = await checkExistingPayroll(employee.id, payPeriod);
  if (existingPayroll) {
    throw new Error('Payroll record already exists for this period');
  }

  const payrollRecord = {
    employeeId: employee.id,
    employeeName: `${employee.firstName} ${employee.lastName}`,
    payPeriod,
    basicSalary: components.basicSalary,
    overtime: components.overtimePay,
    deductions: components.deductions + deductions,
    netSalary: components.netSalary - deductions,
    paymentDate: new Date(),
    status: 'pending',
    taxDeductions: components.taxes,
    benefits: components.benefits,
    bonuses,
    department: employee.department,
    position: employee.position,
    comments: generatePayrollComments(components)
  };

  const docRef = await addDoc(collection(db, 'payroll'), payrollRecord);
  return { id: docRef.id, ...payrollRecord };
};

const checkExistingPayroll = async (employeeId: string, payPeriod: string) => {
  const q = query(
    collection(db, 'payroll'),
    where('employeeId', '==', employeeId),
    where('payPeriod', '==', payPeriod)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

const generatePayrollComments = (components: ReturnType<typeof calculatePayrollComponents>) => {
  return `Social Security: $${components.socialSecurity.toFixed(2)}, 
          Health Insurance: $${components.healthInsurance.toFixed(2)}, 
          Tax Rate: ${(components.taxes / components.taxableIncome * 100).toFixed(1)}%`;
};

export const subscribeToPayrollRecords = (
  startDate: Date,
  endDate: Date,
  callback: (records: PayrollRecord[]) => void
) => {
  const q = query(
    collection(db, 'payroll'),
    where('paymentDate', '>=', Timestamp.fromDate(startDate)),
    where('paymentDate', '<=', Timestamp.fromDate(endDate))
  );

  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PayrollRecord[];
    callback(records);
  });
};

export const fetchEmployees = async () => {
  const snapshot = await getDocs(collection(db, 'employees'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Employee[];
};