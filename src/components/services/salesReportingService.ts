import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { SalesOrder } from '../../components/features/SalesOrderManagement/SalesOrderCreation/types';

export interface SalesMetrics {
  totalSales: number;
  averageOrderValue: number;
  orderCount: number;
  salesByType: Record<string, number>;
  salesTrend: Array<{
    date: string;
    amount: number;
  }>;
}

export const fetchSalesMetrics = async (startDate: Date, endDate: Date): Promise<SalesMetrics> => {
  const salesQuery = query(
    collection(db, 'salesOrders'),
    where('orderDate', '>=', Timestamp.fromDate(startDate)),
    where('orderDate', '<=', Timestamp.fromDate(endDate))
  );

  const snapshot = await getDocs(salesQuery);
  const orders = snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    orderDate: doc.data().orderDate.toDate()
  })) as SalesOrder[];

  const salesByType: Record<string, number> = {};
  let totalSales = 0;

  orders.forEach(order => {
    totalSales += order.totalAmount;
    salesByType[order.orderType] = (salesByType[order.orderType] || 0) + order.totalAmount;
  });

  // Group sales by date for trend analysis
  const salesByDate = orders.reduce((acc, order) => {
    const date = order.orderDate.toLocaleDateString();
    acc[date] = (acc[date] || 0) + order.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const salesTrend = Object.entries(salesByDate)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    totalSales,
    averageOrderValue: orders.length ? totalSales / orders.length : 0,
    orderCount: orders.length,
    salesByType,
    salesTrend
  };
};