export interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    taxId?: string;
    paymentTerms?: string;
    status: 'active' | 'inactive';
  }