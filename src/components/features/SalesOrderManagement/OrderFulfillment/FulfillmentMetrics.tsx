import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { FulfillmentOrder, FulfillmentMetrics } from './types';

interface FulfillmentMetricsProps {
  orders: FulfillmentOrder[];
}

const calculateMetrics = (orders: FulfillmentOrder[]): FulfillmentMetrics => {
  const metrics: FulfillmentMetrics = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    shippedOrders: orders.filter(o => o.status === 'shipped').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    averageDeliveryTime: 0,
    onTimeDeliveries: 0,
    lateDeliveries: 0
  };

  const deliveredOrders = orders.filter(o => o.status === 'delivered' && o.actualDeliveryDate);
  if (deliveredOrders.length > 0) {
    const totalDeliveryTime = deliveredOrders.reduce((sum, order) => {
      const deliveryTime = order.actualDeliveryDate!.getTime() - order.createdAt.getTime();
      return sum + deliveryTime;
    }, 0);
    metrics.averageDeliveryTime = totalDeliveryTime / deliveredOrders.length / (1000 * 60 * 60 * 24); // Convert to days

    deliveredOrders.forEach(order => {
      if (order.actualDeliveryDate! <= order.estimatedDeliveryDate) {
        metrics.onTimeDeliveries++;
      } else {
        metrics.lateDeliveries++;
      }
    });
  }

  return metrics;
};

const FulfillmentMetricsDisplay: React.FC<FulfillmentMetricsProps> = ({ orders }) => {
  const metrics = calculateMetrics(orders);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalOrders}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{metrics.pendingOrders}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">On-Time Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{metrics.onTimeDeliveries}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Late Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{metrics.lateDeliveries}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FulfillmentMetricsDisplay;