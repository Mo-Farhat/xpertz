import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Download } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  costPrice: number;
  category: string;
  beginningInventory: number;
  endingInventory: number;
  salesQuantity: number;
}

const InventoryTurnoverReport = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventoryData = async () => {
      if (!tenant) return;
      
      try {
        setLoading(true);
        const now = new Date();
        let startDate = new Date();
        
        switch (period) {
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'quarter':
            startDate.setMonth(now.getMonth() - 3);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }

        const inventoryRef = collection(db, 'inventory');
        const salesRef = collection(db, 'sales');
        
        // Get current inventory
        const inventorySnapshot = await getDocs(inventoryRef);
        const salesSnapshot = await getDocs(
          query(
            salesRef,
            where('date', '>=', Timestamp.fromDate(startDate)),
            where('date', '<=', Timestamp.fromDate(now))
          )
        );

        const inventoryData = inventorySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          quantity: doc.data().quantity,
          costPrice: doc.data().costPrice || 0,
          category: doc.data().category || 'Uncategorized',
          beginningInventory: doc.data().quantity,
          endingInventory: doc.data().quantity,
          salesQuantity: 0
        }));

        // Calculate sales quantities
        salesSnapshot.docs.forEach(doc => {
          const salesData = doc.data();
          salesData.items.forEach((item: any) => {
            const inventoryItem = inventoryData.find(inv => inv.id === item.id);
            if (inventoryItem) {
              inventoryItem.salesQuantity += item.quantity;
            }
          });
        });

        // Calculate turnover metrics
        const processedData = inventoryData.map(item => {
          const averageInventory = (item.beginningInventory + item.endingInventory) / 2;
          const turnoverRatio = averageInventory > 0 ? item.salesQuantity / averageInventory : 0;
          return {
            ...item,
            turnoverRatio,
            daysToSell: turnoverRatio > 0 ? Math.round(365 / turnoverRatio) : 0
          };
        });

        setInventory(processedData);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        toast({
          title: "Error",
          description: "Failed to load inventory turnover data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, [tenant, period, toast]);

  const handleExport = () => {
    const csvContent = [
      ['Item Name', 'Category', 'Beginning Inventory', 'Ending Inventory', 'Sales Quantity', 'Turnover Ratio', 'Days to Sell'],
      ...inventory.map(item => [
        item.name,
        item.category,
        item.beginningInventory,
        item.endingInventory,
        item.salesQuantity,
        (item as any).turnoverRatio.toFixed(2),
        (item as any).daysToSell
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_turnover_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Inventory Turnover Report</CardTitle>
          <div className="flex gap-4">
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
                <TableHead className="text-right">Beginning Inventory</TableHead>
                <TableHead className="text-right">Ending Inventory</TableHead>
                <TableHead className="text-right">Sales Quantity</TableHead>
                <TableHead className="text-right">Turnover Ratio</TableHead>
                <TableHead className="text-right">Days to Sell</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">{item.beginningInventory}</TableCell>
                  <TableCell className="text-right">{item.endingInventory}</TableCell>
                  <TableCell className="text-right">{item.salesQuantity}</TableCell>
                  <TableCell className="text-right">{(item as any).turnoverRatio.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{(item as any).daysToSell}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryTurnoverReport;