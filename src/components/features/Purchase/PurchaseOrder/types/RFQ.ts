export interface RFQItem {
    id: string;
    productName: string;
    quantity: number;
    specifications?: string;
  }
  
  export interface RFQ {
    id: string;
    rfqNumber: string;
    requisitionId?: string;
    suppliers: string[];
    dueDate: Date;
    status: 'draft' | 'sent' | 'pending' | 'completed';
    items: RFQItem[];
    terms: string;
  }