export interface SalesData {
    id: string;
    date: Date;
    customerId: string;
    customerName: string;
    customerSegment: 'retail' | 'wholesale' | 'distributor';
    region: string;
    products: {
      id: string;
      name: string;
      category: string;
      quantity: number;
      price: number;
      total: number;
    }[];
    total: number;
  }
  
  export interface SalesSummary {
    totalSales: number;
    averageTransaction: number;
    topProducts: {
      id: string;
      name: string;
      totalSales: number;
      quantity: number;
    }[];
    topCustomers: {
      id: string;
      name: string;
      totalPurchases: number;
      totalAmount: number;
    }[];
    salesBySegment: Record<string, number>;
    salesByRegion: Record<string, number>;
    monthlySales: Record<string, number>;
  }