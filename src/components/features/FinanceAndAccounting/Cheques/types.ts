export interface Cheque {
    id: string;
    chequeNumber: string;
    amount: number;
    date: Date;
    payeeName: string;
    bankName: string;
    status: 'pending' | 'cleared' | 'bounced' | 'cancelled';
    type: 'incoming' | 'outgoing';
    memo?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ChequeFormData extends Omit<Cheque, 'id' | 'createdAt' | 'updatedAt'> {}