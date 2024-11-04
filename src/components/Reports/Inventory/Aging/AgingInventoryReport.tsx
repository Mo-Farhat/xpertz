import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Button } from '../../../ui/button';
import { Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { differenceInDays } from 'date-fns';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  lastSaleDate: Date;
  lastRestockDate: Date;
  category: string;
  price: number;
}

const AgingInventoryReport = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [agingThreshold, setAgingThreshold] = useState<number>(90); // Days

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventoryRef = collection(db, 'inventory');
        const querySnapshot = await getDocs(query(inventoryRef));
        
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          quantity: doc.data().quantity,
          lastSaleDate: doc.data().lastSaleDate?.toDate() || new Date(),
          lastRestockDate: doc.data().lastRestockDate?.toDate() || new Date(),
          category: doc.data().category || 'Uncategorized',
          price: doc.data().price || 0
        }));
        
        setInventory(items);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  const getAgingDays = (item: InventoryItem) => {
    const lastMovementDate = new Date(Math.max(
      item.lastSaleDate.getTime(),
      item.lastRestockDate.getTime()
    ));
    return differenceInDays(new Date(), lastMovementDate);
  };

  const getAgingCategory = (days: number) => {
    if (days > 365) return { label: 'Over 1 Year', color: 'text-red-500' };
    if (days > 180) return { label: '6-12 Months', color: 'text-orange-500' };
    if (days > 90) return { label: '3-6 Months', color: 'text-yellow-500' };
    return { label: 'Under 3 Months', color: 'text-green-500' };
  };

  const calculateInventoryValue = (item: InventoryItem) => {
    return item.quantity * item.price;
  };

  const sortedInventory = [...inventory].sort((a, b) => {
    return getAgingDays(b) - getAgingDays(a);
  });

  const handleExport = () => {
    const csvContent = [
      ['Item Name', 'Category', 'Quantity', 'Days Since Last Movement', 'Aging Category', 'Value'],
      ...sortedInventory.map(item => {
        const agingDays = getAgingDays(item);
        return [
          item.name,
          item.category,
          item.quantity.toString(),
          agingDays.toString(),
          getAgingCategory(agingDays).label,
          calculateInventoryValue(item).toFixed(2)
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'aging_inventory_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Aging Inventory Report</CardTitle>
          <div className="flex gap-4">
            <Select 
              value={agingThreshold.toString()} 
              onValueChange={(value) => setAgingThreshold(Number(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Aging threshold" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="60">60 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="180">180 Days</SelectItem>
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
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Days Since Last Movement</TableHead>
                <TableHead>Aging Category</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInventory
                .filter(item => getAgingDays(item) >= agingThreshold)
                .map((item) => {
                  const agingDays = getAgingDays(item);
                  const { label, color } = getAgingCategory(agingDays);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{agingDays}</TableCell>
                      <TableCell className={color}>{label}</TableCell>
                      <TableCell className="text-right">
                        ${calculateInventoryValue(item).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgingInventoryReport;