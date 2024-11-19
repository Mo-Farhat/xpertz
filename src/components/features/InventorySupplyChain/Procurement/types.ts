import { Timestamp } from 'firebase/firestore';

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  status?: 'active' | 'inactive';
  paymentTerms?: string;
  taxId?: string;
  website?: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  items: PurchaseOrderItem[];
  status: 'pending' | 'approved' | 'shipped' | 'received' | 'cancelled';
  totalAmount: number;
  paymentTerms?: string;
  shippingAddress?: string;
  notes?: string;
  attachments?: string[];
  createdBy?: string;
  approvedBy?: string;
  approvalDate?: Date;
}

export interface PurchaseOrderItem {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
  unit?: string;
  tax?: number;
  discount?: number;
}

export interface VendorFormData extends Omit<Vendor, 'id'> {}
export interface PurchaseOrderFormData extends Omit<PurchaseOrder, 'id'> {}