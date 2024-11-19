import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Order } from '../types';

interface OrderMetricsProps {
  orders: Order[];
}

const OrderMetrics: React.FC<OrderMetricsProps> = ({ orders }) => {
  const totalOrders = orders.length;
  const totalValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const avgOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{pendingOrders}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Order Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderMetrics;