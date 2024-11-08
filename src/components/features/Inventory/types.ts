export interface Product {
    id: string;
    name: string;
    quantity: number;
    price: number;
    stock: number;
    lowStockThreshold: number;
    imageUrl?: string;
    barcode?: string;
    manufacturer?: string;
  }
  
  export interface ProductWithFile extends Omit<Product, 'id'> {
    imageFile?: File;
  }