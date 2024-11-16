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