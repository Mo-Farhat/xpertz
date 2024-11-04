import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

interface CustomerPurchaseMetricsProps {
  data: Array<{
    customerId: string;
    customerName: string;
    total: number;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
  }>;
}

const CustomerPurchaseMetrics: React.FC<CustomerPurchaseMetricsProps> = ({ data }) => {
  const totalPurchases = data.reduce((sum, purchase) => sum + purchase.total, 0);
  const uniqueCustomers = new Set(data.map(purchase => purchase.customerId)).size;
  const averageOrderValue = totalPurchases / data.length || 0;
  const totalItems = data.reduce((sum, purchase) => sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalPurchases.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unique Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{uniqueCustomers}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Order Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Items Sold</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalItems}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerPurchaseMetrics;