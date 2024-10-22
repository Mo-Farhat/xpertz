export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  lowStockThreshold: number;
  imageUrl?: string;
  barcode?: string;
}

export interface CartItem extends Product {
  quantity: number;
  discount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  hirePurchaseCustomer: boolean;
}

export interface HirePurchaseAgreement {
  selectedCustomer: { id: string; name: string };
  items: CartItem[];
  months: number;
  interestRate: number;
  downPayment: number;
  paymentFrequency: string;
  totalAmount: number;
  amountToFinance: number;
  monthlyPayment: number;
}

export interface SalesContextType {
  products: Product[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  discount: number;
  isHirePurchase: boolean;
  setIsHirePurchase: React.Dispatch<React.SetStateAction<boolean>>;
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
  hirePurchaseItems: CartItem[];
  setHirePurchaseItemsFromCart: () => void;
  createHirePurchaseAgreement: (formData: HirePurchaseAgreement) => Promise<string>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
  setTotalDiscount: (discountPercentage: number) => void;
  applyProductDiscount: (productId: string, discountPercentage: number) => void;
  handleCheckout: () => Promise<string>;
}