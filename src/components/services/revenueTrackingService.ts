import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
export interface RevenueSource {
  id: string;
  category: 'sales' | 'services' | 'other';
  amount: number;
  date: Date;
  description: string;
  customer?: string;
  paymentMethod?: string;
}
export interface RevenueMetrics {
  totalRevenue: number;
  salesRevenue: number;
  serviceRevenue: number;
  otherRevenue: number;
  periodComparison: {
    previousPeriod: number;
    percentageChange: number;
  };
}
export const fetchRevenueData = async (
  startDate: Date,
  endDate: Date
): Promise<RevenueSource[]> => {
  const revenueQuery = query(
    collection(db, 'sales'),
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate)),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(revenueQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate()
  })) as RevenueSource[];
};
export const calculateRevenueMetrics = (data: RevenueSource[]): RevenueMetrics => {
  const metrics = data.reduce(
    (acc, curr) => {
      acc.totalRevenue += curr.amount;
      switch (curr.category) {
        case 'sales':
          acc.salesRevenue += curr.amount;
          break;
        case 'services':
          acc.serviceRevenue += curr.amount;
          break;
        case 'other':
          acc.otherRevenue += curr.amount;
          break;
      }
      return acc;
    },
    { totalRevenue: 0, salesRevenue: 0, serviceRevenue: 0, otherRevenue: 0 }
  );
  // Calculate previous period comparison
  const midPoint = new Date((data[0]?.date.getTime() + data[data.length - 1]?.date.getTime()) / 2);
  const currentPeriodRevenue = data
    .filter(item => item.date > midPoint)
    .reduce((sum, item) => sum + item.amount, 0);
  const previousPeriodRevenue = data
    .filter(item => item.date <= midPoint)
    .reduce((sum, item) => sum + item.amount, 0);
  const percentageChange = previousPeriodRevenue !== 0
    ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
    : 0;
  return {
    ...metrics,
    periodComparison: {
      previousPeriod: previousPeriodRevenue,
      percentageChange
    }
  };
};