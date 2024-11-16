export interface ReturnRefund {
    id: string;
    orderId: string;
    customerName: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'processed';
    amount: number;
    requestDate: Date;
    processedDate?: Date;
    createdAt: Date;
  }
  
  export interface ReturnMetrics {
    totalReturns: number;
    totalAmount: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    processedCount: number;
    averageProcessingTime: number;
  }