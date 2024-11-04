import { Timestamp, FieldValue } from 'firebase/firestore';

export type LoanStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'pending' | 'paid' | 'overdue';
export type LoanAgreementStatus = 'active' | 'completed' | 'defaulted';

export interface LoanRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  purpose: string;
  repaymentPeriod: number;
  requestedDate: string;
  status: LoanStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LoanPayment {
  id: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  notes?: string;
}

export interface LoanAgreement extends Omit<LoanRequest, 'status'> {
  interestRate: number;
  monthlyPayment: number;
  totalAmount: number;
  startDate: Date;
  endDate: Date;
  payments: LoanPayment[];
  status: LoanAgreementStatus;
  remainingBalance?: number;
  lastPaymentDate?: Date;
}

export interface LoanSummary {
  totalActiveLoans: number;
  monthlyRepayments: number;
  activeBorrowers: number;
  totalLoanAmount: number;
  totalRepaidAmount: number;
  overduePayments: number;
}