import { collection, addDoc, updateDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { LoanRequest } from '../../types/loan';

interface CreateLoanRequestParams {
  employeeId: string;
  employeeName: string;
  amount: number;
  purpose: string;
  repaymentPeriod: number;
  requestedDate: string;
}

export const createLoanRequest = async (params: CreateLoanRequestParams): Promise<string> => {
  const timestamp = serverTimestamp();
  const loanRequest = {
    ...params,
    status: 'pending',
    createdAt: timestamp,
    updatedAt: timestamp
  } as Omit<LoanRequest, 'id'>;

  const docRef = await addDoc(collection(db, 'loanRequests'), loanRequest);
  return docRef.id;
};

export const approveLoanRequest = async (requestId: string, interestRate: number): Promise<void> => {
  const requestRef = doc(db, 'loanRequests', requestId);
  await updateDoc(requestRef, { 
    status: 'approved',
    updatedAt: serverTimestamp()
  });
};

export const rejectLoanRequest = async (requestId: string): Promise<void> => {
  const requestRef = doc(db, 'loanRequests', requestId);
  await updateDoc(requestRef, { 
    status: 'rejected',
    updatedAt: serverTimestamp()
  });
};

export const recordLoanPayment = async (agreementId: string, paymentId: string): Promise<void> => {
  const agreementRef = doc(db, 'loanAgreements', agreementId);
  await updateDoc(agreementRef, {
    [`payments.${paymentId}.status`]: 'paid',
    [`payments.${paymentId}.paidDate`]: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};