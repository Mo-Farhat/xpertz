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
    supplierName: string;
    returnDate: Date;
    status: 'pending' | 'approved' | 'rejected';
    amount: number;
    reason: string;
    items: ReturnItem[];
    createdAt: Date;
    updatedAt?: Date;
  }