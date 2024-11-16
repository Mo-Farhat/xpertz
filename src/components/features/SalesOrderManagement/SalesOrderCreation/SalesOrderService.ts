import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { SalesOrder, NewSalesOrder, SalesOrderItem } from './types';
import { Customer } from './types';
import { Product } from './types';

export const salesOrderService = {
  createOrder: async (order: NewSalesOrder) => {
    try {
      const totalAmount = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      return await addDoc(collection(db, 'salesOrders'), {
        ...order,
        totalAmount,
        createdAt: new Date(),
      });
    } catch (error) {
      throw new Error(`Error creating order: ${error}`);
    }
  },

  updateOrder: async (id: string, order: Partial<SalesOrder>) => {
    try {
      const orderRef = doc(db, 'salesOrders', id);
      await updateDoc(orderRef, order);
    } catch (error) {
      throw new Error(`Error updating order: ${error}`);
    }
  },

  deleteOrder: async (id: string) => {
    try {
      const orderRef = doc(db, 'salesOrders', id);
      await deleteDoc(orderRef);
    } catch (error) {
      throw new Error(`Error deleting order: ${error}`);
    }
  },

  subscribeToOrders: (callback: (orders: SalesOrder[]) => void) => {
    const q = query(collection(db, 'salesOrders'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        orderDate: doc.data().orderDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      } as SalesOrder));
      callback(ordersData);
    });
  },

  calculateTotals: (items: SalesOrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  },

  // New methods for fetching customers and inventory items
  fetchCustomers: async (): Promise<Customer[]> => {
    const customersSnapshot = await getDocs(collection(db, 'customers'));
    return customersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Customer));
  },

  fetchInventoryItems: async (): Promise<Product[]> => {
    const inventorySnapshot = await getDocs(collection(db, 'inventory'));
    return inventorySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  }
};