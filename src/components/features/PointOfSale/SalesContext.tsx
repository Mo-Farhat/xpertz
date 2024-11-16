import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Product, CartItem, SalesContextType, Customer, HirePurchaseAgreement } from './types';
import { useSalesOperations } from '../../hooks/useSalesOperation';

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const useSalesContext = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSalesContext must be used within a SalesProvider');
  }
  return context;
};

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isHirePurchase, setIsHirePurchase] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [hirePurchaseItems, setHirePurchaseItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');

  const {
    cart,
    setCart,
    discount,
    setDiscount,
    addToCart,
    removeFromCart,
    clearCart,
    calculateSubtotal,
    calculateTotal,
    handleCheckout,
  } = useSalesOperations();

  useEffect(() => {
    const q = query(collection(db, 'inventory'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        stock: doc.data().quantity,
        quantity: doc.data().quantity,
        lowStockThreshold: doc.data().lowStockThreshold || 10
      } as Product));
      setProducts(productsData);
    }, (error) => {
      console.error("Error fetching products: ", error);
      setError('Failed to fetch products. Please try again.');
    });
    return () => unsubscribe();
  }, []);

  const setHirePurchaseItemsFromCart = () => {
    setHirePurchaseItems([...cart]);
    setIsHirePurchase(true);
  };

  const createHirePurchaseAgreement = async (formData: HirePurchaseAgreement): Promise<void> => {
    try {
      await addDoc(collection(db, 'hirePurchaseAgreements'), {
        ...formData,
        startDate: new Date(),
        endDate: new Date(Date.now() + formData.months * 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      clearCart();
    } catch (error) {
      console.error("Error creating hire purchase agreement: ", error);
      throw error;
    }
  };

  const value: SalesContextType = {
    products,
    cart,
    setCart,
    paymentMethod,
    setPaymentMethod,
    error,
    setError,
    searchTerm,
    setSearchTerm,
    discount,
    isHirePurchase,
    setIsHirePurchase,
    customers,
    selectedCustomer,
    setSelectedCustomer,
    hirePurchaseItems,
    setHirePurchaseItemsFromCart,
    createHirePurchaseAgreement,
    addToCart,
    removeFromCart,
    clearCart,
    calculateSubtotal,
    calculateTotal,
    setTotalDiscount: setDiscount,
    applyProductDiscount: (productId: string, discountPercentage: number) => {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, discount: discountPercentage } : item
      ));
    },
    handleCheckout,
  };

  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
};
