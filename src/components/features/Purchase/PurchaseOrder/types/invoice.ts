export interface InvoiceItem {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    tax?: number;
  }
  
  export interface PurchaseInvoice {
    id: string;
    invoiceNumber: string;
    poNumber: string;
    supplierId: string;
    invoiceDate: Date;
    dueDate: Date;
    status: 'pending' | 'paid' | 'partially_paid' | 'overdue';
    items: InvoiceItem[];
    totalAmount: number;
    paidAmount: number;
    balance: number;
  }