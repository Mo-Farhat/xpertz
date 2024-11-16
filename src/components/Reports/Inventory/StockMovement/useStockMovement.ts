import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { addDays } from 'date-fns';
import { MovementData, ChartDataPoint, MovementMetrics } from './types';
import { DateRange } from 'react-day-picker';

export const useStockMovement = () => {
  const [movements, setMovements] = useState<MovementData[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date()
  });
  const [movementType, setMovementType] = useState<'all' | 'inbound' | 'outbound'>('all');

  useEffect(() => {
    const fetchMovements = async () => {
      if (!dateRange.from) return;
      
      try {
        const q = query(
          collection(db, 'stock-movements'),
          where('date', '>=', Timestamp.fromDate(dateRange.from)),
          where('date', '<=', Timestamp.fromDate(dateRange.to || new Date())),
          orderBy('date')
        );

        const snapshot = await getDocs(q);
        const movementsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        })) as MovementData[];

        setMovements(movementsData);
      } catch (error) {
        console.error('Error fetching movements:', error);
      }
    };

    fetchMovements();
  }, [dateRange]);

  const getChartData = (): ChartDataPoint[] => {
    const data = movements.reduce((acc, movement) => {
      const date = movement.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, inbound: 0, outbound: 0 };
      }
      if (movement.type === 'inbound') {
        acc[date].inbound += movement.quantity;
      } else {
        acc[date].outbound += movement.quantity;
      }
      return acc;
    }, {} as Record<string, ChartDataPoint>);

    return Object.values(data);
  };

  const getMetrics = (): MovementMetrics => {
    const inbound = movements.reduce((sum, m) => m.type === 'inbound' ? sum + m.quantity : sum, 0);
    const outbound = movements.reduce((sum, m) => m.type === 'outbound' ? sum + m.quantity : sum, 0);
    return {
      inbound,
      outbound,
      netChange: inbound - outbound
    };
  };

  return {
    movements,
    dateRange,
    movementType,
    setDateRange,
    setMovementType,
    metrics: getMetrics(),
    chartData: getChartData()
  };
};