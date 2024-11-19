import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { useInventory } from '../useInventory';

const TurnoverReport = () => {
  const { products, loading } = useInventory();
  const [period, setPeriod] = React.useState<'month' | 'quarter' | 'year'>('month');

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Inventory Turnover Analysis</h3>
        <Select value={period} onValueChange={(value: 'month' | 'quarter' | 'year') => setPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Average Turnover Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4.5</p>
            <p className="text-sm text-gray-500">times per {period}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Days Inventory Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">45</p>
            <p className="text-sm text-gray-500">days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">85%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Turnover Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-right">Beginning Inventory</TableHead>
                <TableHead className="text-right">Ending Inventory</TableHead>
                <TableHead className="text-right">Units Sold</TableHead>
                <TableHead className="text-right">Turnover Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">{product.quantity + 50}</TableCell>
                  <TableCell className="text-right">{product.quantity}</TableCell>
                  <TableCell className="text-right">50</TableCell>
                  <TableCell className="text-right">2.5</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TurnoverReport;