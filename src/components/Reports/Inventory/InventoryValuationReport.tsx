import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '../../hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  category: string;
}

const InventoryValuation = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [valuationMethod, setValuationMethod] = useState<'fifo' | 'lifo' | 'average'>('average');
  const { toast } = useToast();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'inventory')));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          costPrice: doc.data().price * 0.7, // Assuming 30% markup
          sellingPrice: doc.data().price
        })) as InventoryItem[];
        setInventory(items);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch inventory data",
          variant: "destructive",
        });
      }
    };

    fetchInventory();
  }, [toast]);

  const calculateValue = (item: InventoryItem) => {
    switch (valuationMethod) {
      case 'fifo':
        return item.quantity * item.costPrice;
      case 'lifo':
        return item.quantity * item.costPrice;
      case 'average':
        return item.quantity * ((item.costPrice + item.sellingPrice) / 2);
      default:
        return 0;
    }
  };

  const totalValue = inventory.reduce((sum, item) => sum + calculateValue(item), 0);
  
  const chartData = inventory.map(item => ({
    name: item.name,
    value: calculateValue(item),
    quantity: item.quantity
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Inventory Valuation</h3>
        <Select value={valuationMethod} onValueChange={(value: any) => setValuationMethod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Valuation method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fifo">FIFO</SelectItem>
            <SelectItem value="lifo">LIFO</SelectItem>
            <SelectItem value="average">Average Cost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <CardTitle>Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {inventory.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Item Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${(totalValue / inventory.length || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Value Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Value ($)" />
                <Bar dataKey="quantity" fill="#10b981" name="Quantity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Valuation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Cost Price</TableHead>
                <TableHead className="text-right">Selling Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.costPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.sellingPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${calculateValue(item).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryValuation;