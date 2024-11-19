import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Order, NewOrder } from './types';
import { useToast } from "../../../hooks/use-toast";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orderData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        orderDate: doc.data().orderDate.toDate(),
      } as Order));
      setOrders(orderData);
    });
    return unsubscribe;
  }, []);

  const addOrder = async (newOrder: NewOrder) => {
    try {
      await addDoc(collection(db, 'orders'), {
        ...newOrder,
        orderDate: new Date(newOrder.orderDate),
      });
      toast({
        title: "Success",
        description: "Order added successfully",
      });
    } catch (error) {
      console.error("Error adding order:", error);
      toast({
        title: "Error",
        description: "Failed to add order",
        variant: "destructive",
      });
    }
  };

  const updateOrder = async (id: string, updatedOrder: Partial<Order>) => {
    try {
      await updateDoc(doc(db, 'orders', id), updatedOrder);
      toast({
        title: "Success",
        description: "Order updated successfully",
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'orders', id));
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
  };
};