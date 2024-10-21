import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Product, CartItem, SalesContextType, HirePurchaseAgreement } from './types';

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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hirePurchaseItems, setHirePurchaseItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState<number>(0);

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

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setError('Cannot add more than available stock');
      }
    } else {
      setCart([...cart, { ...product, quantity: 1, discount: 0 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== productId));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const itemDiscounts = cart.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      return total + (itemTotal * item.discount / 100);
    }, 0);
    const totalAfterItemDiscounts = subtotal - itemDiscounts;
    return totalAfterItemDiscounts - (totalAfterItemDiscounts * discount / 100);
  };

  const setTotalDiscount = (discountPercentage: number) => {
    setDiscount(discountPercentage);
  };

  const applyProductDiscount = (productId: string, discountPercentage: number) => {
    setCart(cart.map(item =>
      item.id === productId ? { ...item, discount: discountPercentage } : item
    ));
  };

  const handleCheckout = async () => {
    try {
      const saleRef = await addDoc(collection(db, 'sales'), {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount
        })),
        subtotal: calculateSubtotal(),
        totalDiscount: discount,
        total: calculateTotal(),
        paymentMethod: paymentMethod,
        date: new Date(),
      });

      for (const item of cart) {
        const productRef = doc(db, 'inventory', item.id);
        await updateDoc(productRef, {
          quantity: increment(-item.quantity)
        });
      }

      clearCart();
      setDiscount(0);
      return saleRef.id;
    } catch (error) {
      console.error("Error processing sale: ", error);
      setError('Failed to process sale. Please try again.');
      throw error;
    }
  };

  const transferCartToHirePurchase = () => {
    setHirePurchaseItems([...cart]);
    clearCart();
  };

  const createHirePurchaseAgreement = async (agreement: HirePurchaseAgreement) => {
    try {
      const agreementRef = await addDoc(collection(db, 'hirePurchaseAgreements'), {
        customerId: agreement.selectedCustomer.id,
        customerName: agreement.selectedCustomer.name,
        items: agreement.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: agreement.totalAmount,
        downPayment: agreement.downPayment,
        months: agreement.months,
        interestRate: agreement.interestRate,
        paymentFrequency: agreement.paymentFrequency,
        amountToFinance: agreement.amountToFinance,
        monthlyPayment: agreement.monthlyPayment,
        createdAt: new Date(),
        status: 'active',
      });

      for (const item of agreement.items) {
        const productRef = doc(db, 'inventory', item.id);
        await updateDoc(productRef, {
          quantity: increment(-item.quantity)
        });
      }

      setHirePurchaseItems([]);

      return agreementRef.id;
    } catch (error) {
      console.error("Error creating hire purchase agreement: ", error);
      throw error;
    }
  };

  const value: SalesContextType = {
    products,
    cart,
    setCart,
    hirePurchaseItems,
    setHirePurchaseItems: transferCartToHirePurchase,
    paymentMethod,
    setPaymentMethod,
    error,
    setError,
    searchTerm,
    setSearchTerm,
    discount,
    addToCart,
    removeFromCart,
    clearCart,
    calculateSubtotal,
    calculateTotal,
    setTotalDiscount,
    applyProductDiscount,
    handleCheckout,
    createHirePurchaseAgreement,
    transferCartToHirePurchase,
  };

  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
};