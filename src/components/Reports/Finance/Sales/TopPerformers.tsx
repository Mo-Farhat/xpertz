import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { SalesSummary } from './types';

interface TopPerformersProps {
  data: SalesSummary;
}

const TopPerformers: React.FC<TopPerformersProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topProducts.slice(0, 10).map((product) => (
              <div key={product.id} className="flex justify-between items-center">
                <span className="font-medium">{product.name}</span>
                <div className="text-right">
                  <p className="font-semibold">${product.totalSales.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{product.quantity} units</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topCustomers.slice(0, 10).map((customer) => (
              <div key={customer.id} className="flex justify-between items-center">
                <span className="font-medium">{customer.name}</span>
                <div className="text-right">
                  <p className="font-semibold">${customer.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{customer.totalPurchases} orders</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopPerformers;