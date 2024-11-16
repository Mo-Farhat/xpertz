export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    tax?: number;
  }
  
  export interface InvoiceFormData {
    invoiceNumber: string;
    poNumber: string;
    supplierId: string;
    dueDate: string;
    paymentTerms: string;
    taxRate: number;
    discount: number;
    notes: string;
    currency: string;
    items: InvoiceItem[];
    subtotal: number;
    totalAmount: number;
    paidAmount: number;
    balance: number;
    status: 'pending' | 'paid' | 'partially_paid' | 'overdue';
  }
  
  export interface LineItemFormData {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }
  
  export interface InvoiceFormProps {
    onSubmit: (data: InvoiceFormData) => Promise<void>;
  }
  
  export interface LineItemsTableProps {
    items: InvoiceItem[];
    onRemoveItem: (id: string) => void;
  }
  
  export interface LineItemFormProps {
    currentItem: LineItemFormData;
    onItemChange: (field: keyof LineItemFormData, value: any) => void;
    onAddItem: () => void;
  } 

  
export interface InvoiceTableProps {
    invoices: InvoiceFormData[];
  }
  
  export interface InvoiceFormProps {
    onSubmit: (data: InvoiceFormData) => Promise<void>;
  }