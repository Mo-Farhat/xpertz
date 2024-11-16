export interface PurchaseOrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    tax?: number;
    discount?: number;
    totalPrice: number;
  }
  
  export type PaymentMethod = 'cash' | 'credit' | 'cheque' | 'bank_transfer';
  
  export interface PurchaseOrder {
    id: string;
    poNumber: string;
    supplierId: string;
    orderDate: Date;
    expectedDeliveryDate: Date;
    status: 'draft' | 'sent' | 'acknowledged' | 'completed' | 'cancelled';
    items: PurchaseOrderItem[];
    totalAmount: number;
    terms: string;
    notes?: string;
    paymentMethod: PaymentMethod;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface PurchaseOrderFormProps {
    onSubmit: (order: PurchaseOrder) => void;
  }