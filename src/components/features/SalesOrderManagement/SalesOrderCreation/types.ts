export interface SalesOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface SalesOrder {
  id: string;
  customerName: string;
  customerId: string;
  orderDate: Date;
  items: SalesOrderItem[];
  totalAmount: number;
  status: 'quote' | 'order' | 'invoice' | 'paid';
  orderType: 'retail' | 'wholesale' | 'online';
  createdAt: Date;
}

export type NewSalesOrder = Omit<SalesOrder, 'id' | 'createdAt'>;

export interface SalesOrderFormProps {
  order: NewSalesOrder;
  onOrderChange: (order: NewSalesOrder) => void;
  onSubmit: (e: React.FormEvent) => void;
}
  
  export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
  }