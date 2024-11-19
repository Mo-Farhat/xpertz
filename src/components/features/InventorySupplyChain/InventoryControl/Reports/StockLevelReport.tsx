import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { useInventory } from '../useInventory';
import { AlertTriangle } from 'lucide-react';

const StockLevelReport = () => {
  const { products, loading } = useInventory();

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return { status: 'Out of Stock', color: 'text-red-500' };
    if (quantity <= threshold) return { status: 'Low Stock', color: 'text-yellow-500' };
    return { status: 'In Stock', color: 'text-green-500' };
  };

  const metrics = {
    total: products.length,
    outOfStock: products.filter(p => p.quantity === 0).length,
    lowStock: products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold).length,
    inStock: products.filter(p => p.quantity > p.lowStockThreshold).length,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.total}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{metrics.inStock}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-500">{metrics.lowStock}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{metrics.outOfStock}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Level Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right">Reorder Point</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const { status, color } = getStockStatus(product.quantity, product.lowStockThreshold);
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                      {status !== 'In Stock' && (
                        <AlertTriangle className="h-4 w-4 inline ml-2 text-yellow-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">{product.lowStockThreshold}</TableCell>
                    <TableCell className={color}>{status}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockLevelReport;