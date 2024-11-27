export interface QuotationContract {
    id: string;
    type: 'quotation' | 'contract';
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    amount: number;
    status: 'draft' | 'sent' | 'accepted' | 'rejected';
    validUntil: Date;
    content: string;
    terms: string;
    paymentTerms: string;
    deliveryTerms: string;
    notes: string;
    attachments: string[];
    assignedTo: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
    tags: string[];
    revisionNumber: number;
    items: QuotationItem[];
    createdAt: Date;
    lastModified: Date;
  }
  
  export interface QuotationItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }
  
  export type NewQuotationContract = Omit<QuotationContract, 'id' | 'createdAt' | 'lastModified'>;
  
  export interface QuotationFormProps {
    onSubmit: (document: NewQuotationContract) => Promise<void>;
  }