export interface FulfillmentOrder {
    id: string;
    orderId: string;
    customerName: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    shippingMethod: string;
    trackingNumber: string;
    estimatedDeliveryDate: Date;
    actualDeliveryDate?: Date;
    createdAt: Date;
  }
  
  export interface FulfillmentMetrics {
    totalOrders: number;
    pendingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    averageDeliveryTime: number;
    onTimeDeliveries: number;
    lateDeliveries: number;
  }