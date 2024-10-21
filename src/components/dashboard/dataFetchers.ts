import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { DollarSign, Package, ShoppingCart, Users, Eye, TrendingUp } from 'lucide-react';
import { WidgetData, SalesData, ProductData, InventoryData } from './types';

export const loadWidgetData = async (selectedWidgets: string[]): Promise<WidgetData[]> => {
  const widgetData: WidgetData[] = [];

  if (selectedWidgets.includes('totalSales')) {
    const salesQuery = query(collection(db, 'salesOrders'));
    const salesSnapshot = await getDocs(salesQuery);
    const totalSales = salesSnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalAmount || 0), 0);
    widgetData.push({
      id: 'totalSales',
      title: 'Total Sales',
      value: `$${totalSales.toFixed(2)}`,
      icon: DollarSign,
      subTitle: 'Today',
      subValue: `$${(totalSales / 30).toFixed(2)}`,
      accumulated: `$${(totalSales * 12).toFixed(2)}`,
      yearToDate: `$${(totalSales * 365).toFixed(2)}`,
    });
  }

  if (selectedWidgets.includes('inventoryCount')) {
    const inventoryQuery = query(collection(db, 'inventory'));
    const inventorySnapshot = await getDocs(inventoryQuery);
    widgetData.push({
      id: 'inventoryCount',
      title: 'Inventory',
      value: inventorySnapshot.size,
      icon: Package,
      subTitle: 'Total Products',
      subValue: inventorySnapshot.size,
      accumulated: '-',
      yearToDate: '-',
    });
  }

  if (selectedWidgets.includes('recentOrders')) {
    const ordersQuery = query(collection(db, 'salesOrders'), orderBy('orderDate', 'desc'), limit(30));
    const ordersSnapshot = await getDocs(ordersQuery);
    widgetData.push({
      id: 'recentOrders',
      title: 'Orders',
      value: ordersSnapshot.size.toString(),
      icon: ShoppingCart,
      subTitle: 'Today',
      subValue: (ordersSnapshot.size / 30).toFixed(0),
      accumulated: (ordersSnapshot.size * 12).toString(),
      yearToDate: (ordersSnapshot.size * 365).toString(),
    });
  }

  if (selectedWidgets.includes('customerCount')) {
    const customersQuery = query(collection(db, 'customers'));
    const customersSnapshot = await getDocs(customersQuery);
    widgetData.push({
      id: 'customerCount',
      title: 'Customers',
      value: customersSnapshot.size,
      icon: Users,
      subTitle: 'Total Customers',
      subValue: customersSnapshot.size,
      accumulated: '-',
      yearToDate: '-',
    });
  }




  return widgetData;
};

export const fetchSalesData = async (): Promise<SalesData[]> => {
  const salesQuery = query(
    collection(db, 'salesOrders'),
    orderBy('orderDate', 'desc'),
    limit(30)
  );
  const salesSnapshot = await getDocs(salesQuery);
  const salesData = salesSnapshot.docs.map(doc => ({
    date: doc.data().orderDate.toDate().toLocaleDateString(),
    amount: doc.data().totalAmount || 0,
  }));
  return salesData.reverse();
};

export const fetchTopProducts = async (): Promise<ProductData[]> => {
  const productsQuery = query(collection(db, 'inventory'), orderBy('quantity', 'desc'), limit(5));
  const productsSnapshot = await getDocs(productsQuery);
  return productsSnapshot.docs.map(doc => ({
    name: doc.data().name,
    sales: doc.data().quantity,
  }));
};

export const fetchInventoryData = async (): Promise<InventoryData[]> => {
  const inventoryQuery = query(collection(db, 'inventory'));
  const inventorySnapshot = await getDocs(inventoryQuery);
  const inventoryCategories = inventorySnapshot.docs.reduce((acc, doc) => {
    const category = doc.data().category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.entries(inventoryCategories).map(([category, count]) => ({
    category,
    count,
  }));
};