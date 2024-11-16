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
  
  export interface PurchaseRequisition {
    id: string;
    requestNumber: string;
    requestedBy: string;
    department: string;
    dateRequired: Date;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    items: RequisitionItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface RequisitionItem {
    id: string;
    productName: string;
    quantity: number;
    estimatedUnitPrice: number;
    totalPrice: number;
    specifications?: string;
  }
  
  export interface PurchaseOrder {
    id: string;
    poNumber: string;
    supplierId: string;
    requisitionId?: string;
    orderDate: Date;
    expectedDeliveryDate: Date;
    status: 'draft' | 'sent' | 'acknowledged' | 'completed' | 'cancelled';
    items: PurchaseOrderItem[];
    totalAmount: number;
    terms: string;
    notes?: string;
  }
  
  export interface PurchaseOrderItem {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    tax?: number;
    discount?: number;
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
  
  export interface RFQItem {
    id: string;
    productName: string;
    quantity: number;
    specifications?: string;
  }
  
  export interface GoodsReceipt {
    id: string;
    receiptNumber: string;
    poNumber: string;
    receivedDate: Date;
    deliveryNoteNumber?: string;
    status: 'pending' | 'completed' | 'rejected';
    items: GoodsReceiptItem[];
    notes?: string;
  }
  
  export interface GoodsReceiptItem {
    id: string;
    productName: string;
    quantityOrdered: number;
    quantityReceived: number;
    quantityAccepted: number;
    remarks?: string;
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
  
  export interface InvoiceItem {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    tax?: number;
  }
  
  export interface PurchaseReturn {
    id: string;
    returnNumber: string;
    poNumber: string;
    supplierId: string;
    returnDate: Date;
    status: 'pending' | 'approved' | 'completed' | 'rejected';
    items: ReturnItem[];
    reason: string;
    totalAmount: number;
  }
  
  export interface ReturnItem {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    reason: string;
  }