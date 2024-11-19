export interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    reorderPoint: number;
    unitCost: number;
    location: string;
    category?: string;
    supplier?: string;
    lastRestockDate?: Date;
    minimumOrderQuantity?: number;
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
  }
  
  export interface InventoryStats {
    totalItems: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
  }