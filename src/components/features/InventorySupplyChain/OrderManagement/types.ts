export interface Order {
    id: string;
    customerId: string;
    orderDate: Date;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: string;
    trackingNumber?: string;
  }
  
  export interface OrderItem {
    itemId: string;
    quantity: number;
    price: number;
  }
  
  export type NewOrder = Omit<Order, 'id'>;