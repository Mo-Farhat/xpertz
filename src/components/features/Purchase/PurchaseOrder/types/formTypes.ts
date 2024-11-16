import { PurchaseOrder } from './purchaseOrderTypes';

export interface PurchaseOrderFormState {
  selectedSupplier: string;
  terms: string;
  notes: string;
}

export interface PurchaseOrderItemFormState {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  tax?: number;
  discount?: number;
  totalPrice: number;
}