import { useState } from 'react';
import { CartItem, Product } from '../features/PointOfSale/types';
import { generateOrderId } from './orderUtils';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

export const useSalesOperations = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
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
    setDiscount(0);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const itemDiscounts = cart.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      return total + (itemTotal * (item.discount || 0) / 100);
    }, 0);
    const totalAfterItemDiscounts = subtotal - itemDiscounts;
    return totalAfterItemDiscounts - (totalAfterItemDiscounts * discount / 100);
  };

  const handleCheckout = async () => {
    try {
      const orderId = generateOrderId();
      const saleData = {
        orderId,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount || 0
        })),
        subtotal: calculateSubtotal(),
        totalDiscount: discount,
        total: calculateTotal(),
        date: new Date(),
        status: 'completed',
      };

      // Create sale record
      await addDoc(collection(db, 'sales'), saleData);

      // Update inventory
      for (const item of cart) {
        const productRef = doc(db, 'inventory', item.id);
        await updateDoc(productRef, {
          quantity: item.stock - item.quantity
        });
      }

      clearCart();
    } catch (error) {
      console.error('Error during checkout:', error);
      throw new Error('Failed to complete checkout. Please try again.');
    }
  };

  return {
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
  };
};