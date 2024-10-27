import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { HirePurchaseAgreement, HirePurchasePayment } from '../../types/hirePurchase';

export const createHirePurchaseAgreement = async (
  customerId: string,
  customerName: string,
  items: any[],
  totalAmount: number,
  downPayment: number,
  interestRate: number,
  term: number
): Promise<string> => {
  const amountFinanced = totalAmount - downPayment;
  const monthlyPayment = (amountFinanced * (1 + interestRate / 100)) / term;
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + term);

  // Generate payment schedule
  const payments: HirePurchasePayment[] = Array.from({ length: term }, (_, i) => {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i + 1);
    return {
      id: `payment-${i + 1}`,
      amount: monthlyPayment,
      dueDate,
      status: 'pending'
    };
  });

  const agreement: Omit<HirePurchaseAgreement, 'id'> = {
    customerId,
    customerName,
    items,
    totalAmount,
    downPayment,
    amountFinanced,
    interestRate,
    term,
    monthlyPayment,
    startDate,
    endDate,
    payments,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const docRef = await addDoc(collection(db, 'hirePurchaseAgreements'), agreement);
  return docRef.id;
};

export const recordPayment = async (agreementId: string, paymentId: string) => {
  const agreementRef = doc(db, 'hirePurchaseAgreements', agreementId);
  const agreementDoc = await getDoc(agreementRef);
  
  if (!agreementDoc.exists()) {
    throw new Error('Agreement not found');
  }

  const agreement = agreementDoc.data() as HirePurchaseAgreement;
  const updatedPayments = agreement.payments.map(payment => 
    payment.id === paymentId 
      ? { ...payment, status: 'paid', paidDate: new Date() }
      : payment
  );

  // Check if all payments are completed
  const allPaid = updatedPayments.every(payment => payment.status === 'paid');
  
  await updateDoc(agreementRef, {
    payments: updatedPayments,
    status: allPaid ? 'completed' : 'active',
    updatedAt: new Date()
  });
};

export const getCustomerAgreements = async (customerId: string): Promise<HirePurchaseAgreement[]> => {
  const q = query(
    collection(db, 'hirePurchaseAgreements'),
    where('customerId', '==', customerId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as HirePurchaseAgreement));
};

export const getAgreement = async (agreementId: string): Promise<HirePurchaseAgreement> => {
  const docRef = doc(db, 'hirePurchaseAgreements', agreementId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Agreement not found');
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data()
  } as HirePurchaseAgreement;
};