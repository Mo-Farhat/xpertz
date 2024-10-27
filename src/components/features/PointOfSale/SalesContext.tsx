import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Product, CartItem, SalesContextType, Customer, HirePurchaseAgreement } from './types';
import { createHirePurchaseAgreement as createAgreement } from '../../services/hirePurchaseService';
import { useToast } from "../../hooks/use-toast";

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
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [isHirePurchase, setIsHirePurchase] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [hirePurchaseItems, setHirePurchaseItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

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

  useEffect(() => {
    const q = query(collection(db, 'customers'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Customer));
      setCustomers(customersData);
    }, (error) => {
      console.error("Error fetching customers: ", error);
      setError('Failed to fetch customers. Please try again.');
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
    setHirePurchaseItems([]);
    setIsHirePurchase(false);
    setSelectedCustomer(null);
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

  const setHirePurchaseItemsFromCart = () => {
    console.log('Setting hire purchase items from cart:', cart);
    setHirePurchaseItems([...cart]);
    setIsHirePurchase(true);
  };

  const createHirePurchaseAgreement = async (formData: HirePurchaseAgreement): Promise<string> => {
    try {
      console.log('Creating hire purchase agreement with data:', formData);
      const agreementId = await createAgreement(
        formData.selectedCustomer.id,
        formData.selectedCustomer.name,
        formData.items,
        formData.totalAmount,
        formData.downPayment,
        formData.interestRate,
        formData.months
      );

      // Update inventory quantities
      for (const item of formData.items) {
        const productRef = doc(db, 'inventory', item.id);
        await updateDoc(productRef, {
          quantity: increment(-item.quantity)
        });
      }

      // Add the hire purchase transaction to sales collection
      await addDoc(collection(db, 'sales'), {
        items: formData.items,
        customerId: formData.selectedCustomer.id,
        customerName: formData.selectedCustomer.name,
        totalAmount: formData.totalAmount,
        downPayment: formData.downPayment,
        amountFinanced: formData.amountToFinance,
        interestRate: formData.interestRate,
        term: formData.months,
        monthlyPayment: formData.monthlyPayment,
        type: 'hire-purchase',
        agreementId,
        date: new Date(),
      });

      toast({
        title: "Success",
        description: "Hire purchase agreement created successfully",
      });

      clearCart();
      return agreementId;
    } catch (error) {
      console.error("Error creating hire purchase agreement: ", error);
      toast({
        title: "Error",
        description: "Failed to create hire purchase agreement",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleCheckout = async () => {
    try {
      await addDoc(collection(db, 'sales'), {
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
        type: 'regular',
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
      toast({
        title: "Success",
        description: "Sale completed successfully!",
      });
    } catch (error) {
      console.error("Error processing sale: ", error);
      toast({
        title: "Error",
        description: "Failed to process sale. Please try again.",
        variant: "destructive",
      });
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
    setTotalDiscount,
    applyProductDiscount,
    handleCheckout,
  };

  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
};