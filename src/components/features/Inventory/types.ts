export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  minSellingPrice: number;
  lowStockThreshold: number;
  imageUrl?: string;
  barcode?: string;
  manufacturer?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductWithFile extends Omit<Product, 'id'> {
  imageFile?: File;
}