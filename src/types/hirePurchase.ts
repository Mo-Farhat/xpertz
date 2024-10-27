export interface HirePurchasePayment {
    id: string;
    amount: number;
    dueDate: Date;
    paidDate?: Date;
    status: 'pending' | 'paid' | 'overdue';
  }
  
  export interface HirePurchaseAgreement {
    id: string;
    customerId: string;
    customerName: string;
    items: {
      id: string;
      name: string;
      quantity: number;
      price: number;
      discount: number;
    }[];
    totalAmount: number;
    downPayment: number;
    amountFinanced: number;
    interestRate: number;
    term: number; // in months
    monthlyPayment: number;
    startDate: Date;
    endDate: Date;
    payments: HirePurchasePayment[];
    status: 'active' | 'completed' | 'defaulted';
    createdAt: Date;
    updatedAt: Date;
  }