import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../..//components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../..//components/ui/tabs";
import { useOrders } from '../useOrder';
import OrderMetrics from './OrderMetrics';
import OrderTrends from './OrderTrends';
import OrderStatusDistribution from './OrderStatusDistribution';

const OrderReports: React.FC = () => {
  const { orders } = useOrders();

  return (
    <div className="space-y-6">
      <OrderMetrics orders={orders} />
      
      <Tabs defaultValue="trends" className="w-full">
        <TabsList>
          <TabsTrigger value="trends">Order Trends</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Order Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTrends orders={orders} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusDistribution orders={orders} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderReports;