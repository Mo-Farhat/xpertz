export interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    minSellingPrice: number;
    lowStockThreshold: number;
    imageUrl?: string;
    barcode?: string;
    manufacturer?: string;
    category?: string;
    description?: string;
    discount?: number;
  }
  
  export interface ProductWithFile extends Omit<Product, 'id'> {
    imageFile?: File;
  }