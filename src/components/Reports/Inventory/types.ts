export interface MovementData {
    date: Date;
    type: 'inbound' | 'outbound';
    quantity: number;
    product: string;
    reason: string;
  }
  
  export interface MovementMetrics {
    inbound: number;
    outbound: number;
    netChange: number;
  }
  
  export interface ChartDataPoint {
    date: string;
    inbound: number;
    outbound: number;
  }