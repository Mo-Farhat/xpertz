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
}

export interface HirePurchaseAgreement {
  selectedCustomer: { id: string; name: string };
  items: CartItem[];
  totalAmount: number;
  downPayment: number;
  months: number;
  interestRate: number;
  paymentFrequency: string;
  amountToFinance: number;
  monthlyPayment: number;
}

export interface SalesContextType {
  products: Product[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  hirePurchaseItems: CartItem[];
  setHirePurchaseItems: () => void;
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  discount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
  setTotalDiscount: (discountPercentage: number) => void;
  applyProductDiscount: (productId: string, discountPercentage: number) => void;
  handleCheckout: () => Promise<string>;
  createHirePurchaseAgreement: (agreement: HirePurchaseAgreement) => Promise<string>;
  transferCartToHirePurchase: () => void;
}