export interface MovementData {
    id: string;
    date: Date;
    type: 'inbound' | 'outbound';
    quantity: number;
    product: string;
    reason: string;
  }
  
  export interface ChartDataPoint {
    date: string;
    inbound: number;
    outbound: number;
  }
  
  export interface MovementMetrics {
    inbound: number;
    outbound: number;
    netChange: number;
  }