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