export type CustomerType = 'regular' | 'debt' | 'cheque' | 'installment';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  notes: string;
  type: CustomerType;
  status: 'active' | 'inactive';
  loyaltyPoints: number;
  hirePurchaseCustomer: boolean;
  createdAt: Date;
}

export type CustomerFormData = Omit<Customer, 'id' | 'createdAt'>;