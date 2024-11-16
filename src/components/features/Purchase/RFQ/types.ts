export interface RFQItem {
    id: string;
    productName: string;
    quantity: number;
    specifications?: string;
    estimatedUnitPrice?: number;
    preferredDeliveryDate?: Date;
    technicalRequirements?: string;
    qualityStandards?: string;
  }
  
  export interface RFQSupplier {
    id: string;
    name: string;
    email: string;
    status: 'pending' | 'responded' | 'declined';
    responseDate?: Date;
    quotedPrice?: number;
    deliveryTimeframe?: string;
    notes?: string;
  }
  
  export interface RFQ {
    id: string;
    rfqNumber: string;
    title: string;
    description?: string;
    requisitionId?: string;
    suppliers: RFQSupplier[];
    dueDate: Date;
    status: 'draft' | 'sent' | 'pending' | 'completed' | 'cancelled';
    items: RFQItem[];
    terms: string;
    paymentTerms?: string;
    deliveryTerms?: string;
    validityPeriod?: number;
    attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    department?: string;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    notes?: string;
  }
  
  export interface RFQFormProps {
    onSubmit: (rfq: Omit<RFQ, 'id'>) => Promise<void>;
    initialData?: RFQ;
  }
  
  export interface RFQItemFormProps {
    item: Partial<RFQItem>;
    onItemChange: (field: keyof Omit<RFQItem, 'id'>, value: any) => void;
    onAddItem: () => void;
  }