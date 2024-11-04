import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../../ui/button';
import { Download } from 'lucide-react';

type CostMethod = 'FIFO' | 'LIFO' | 'WAC';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  lastRestockDate: Date;
}

const InventoryValuationReport = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [costMethod, setCostMethod] = useState<CostMethod>('WAC');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventoryRef = collection(db, 'inventory');
        const querySnapshot = await getDocs(query(inventoryRef));
        
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          quantity: doc.data().quantity,
          costPrice: doc.data().costPrice || doc.data().price * 0.7, // Fallback if costPrice not set
          sellingPrice: doc.data().price,
          lastRestockDate: doc.data().lastRestockDate?.toDate() || new Date()
        }));
        
        setInventory(items);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const calculateItemValue = (item: InventoryItem) => {
    switch (costMethod) {
      case 'FIFO':
        return item.quantity * item.costPrice;
      case 'LIFO':
        return item.quantity * item.costPrice;
      case 'WAC':
        return item.quantity * ((item.costPrice + item.sellingPrice) / 2);
      default:
        return 0;
    }
  };

  const totalValue = inventory.reduce((sum, item) => sum + calculateItemValue(item), 0);

  const handleExport = () => {
    const csvContent = [
      ['Item Name', 'Quantity', 'Cost Price', 'Selling Price', 'Total Value'],
      ...inventory.map(item => [
        item.name,
        item.quantity.toString(),
        item.costPrice.toFixed(2),
        item.sellingPrice.toFixed(2),
        calculateItemValue(item).toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_valuation_${costMethod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Inventory Valuation Report</CardTitle>
          <div className="flex gap-4">
            <Select value={costMethod} onValueChange={(value: CostMethod) => setCostMethod(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select cost method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIFO">FIFO</SelectItem>
                <SelectItem value="LIFO">LIFO</SelectItem>
                <SelectItem value="WAC">Weighted Average Cost</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
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
                  <TableCell className="text-right">${calculateItemValue(item).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell colSpan={4}>Total Inventory Value</TableCell>
                <TableCell className="text-right">${totalValue.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryValuationReport;