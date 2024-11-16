export interface PurchaseOrderItem {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    tax?: number;
    discount?: number;
    totalPrice: number;
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
  
  // Form State Types
  export interface PurchaseOrderFormState {
    selectedSupplier: string;
    deliveryDate: string;
    terms: string;
    notes: string;
  }
  
  export interface PurchaseOrderItemFormState {
    productName: string;
    quantity: number;
    unitPrice: number;
    tax?: number;
    discount?: number;
    totalPrice: number;
  }
  
  export interface PurchaseOrderFormProps {
    onSubmit?: (order: PurchaseOrder) => void;
  }
  
  // Supplier Types
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
  
  // Requisition Types
  export interface RequisitionItem {
    id: string;
    productName: string;
    quantity: number;
    estimatedUnitPrice: number;
    totalPrice: number;
    specifications?: string;
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
  
  // RFQ Types
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
  
  // Goods Receipt Types
  export interface GoodsReceiptItem {
    id: string;
    productName: string;
    quantityOrdered: number;
    quantityReceived: number;
    quantityAccepted: number;
    remarks?: string;
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
  
  // Invoice Types
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
  
  // Return Types
  export interface ReturnItem {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    reason: string;
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
  