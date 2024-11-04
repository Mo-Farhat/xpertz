import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Download, AlertTriangle } from 'lucide-react';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  lowStockThreshold: number;
  manufacturer: string;
  category: string;
  lastRestockDate: Date;
  reorderQuantity: number;
  leadTime: number; // in days
}

const ReorderReport = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filterBy, setFilterBy] = useState<'all' | 'critical' | 'warning'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventoryRef = collection(db, 'inventory');
        const querySnapshot = await getDocs(query(inventoryRef));
        
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          quantity: doc.data().quantity,
          lowStockThreshold: doc.data().lowStockThreshold || 10,
          manufacturer: doc.data().manufacturer || 'N/A',
          category: doc.data().category || 'Uncategorized',
          lastRestockDate: doc.data().lastRestockDate?.toDate() || new Date(),
          reorderQuantity: doc.data().reorderQuantity || doc.data().lowStockThreshold * 2,
          leadTime: doc.data().leadTime || 7
        }));
        
        setInventory(items);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return 'Out of Stock';
    if (item.quantity <= item.lowStockThreshold / 2) return 'Critical';
    if (item.quantity <= item.lowStockThreshold) return 'Warning';
    return 'In Stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Out of Stock':
      case 'Critical':
        return 'text-red-500';
      case 'Warning':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getDaysUntilReorder = (item: InventoryItem) => {
    const dailyUsage = item.reorderQuantity / 30; // Assuming monthly reorder quantity
    if (dailyUsage === 0) return Infinity;
    return Math.floor(item.quantity / dailyUsage);
  };

  const filteredItems = inventory
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const status = getStockStatus(item);
      switch (filterBy) {
        case 'critical':
          return matchesSearch && (status === 'Critical' || status === 'Out of Stock');
        case 'warning':
          return matchesSearch && status === 'Warning';
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => {
      const statusA = getStockStatus(a);
      const statusB = getStockStatus(b);
      if (statusA === statusB) return a.name.localeCompare(b.name);
      if (statusA === 'Out of Stock') return -1;
      if (statusB === 'Out of Stock') return 1;
      if (statusA === 'Critical') return -1;
      if (statusB === 'Critical') return 1;
      if (statusA === 'Warning') return -1;
      if (statusB === 'Warning') return 1;
      return 0;
    });

  const handleExport = () => {
    const csvContent = [
      ['Item Name', 'Current Stock', 'Threshold', 'Status', 'Reorder Quantity', 'Lead Time (days)', 'Days Until Reorder'],
      ...filteredItems.map(item => [
        item.name,
        item.quantity.toString(),
        item.lowStockThreshold.toString(),
        getStockStatus(item),
        item.reorderQuantity.toString(),
        item.leadTime.toString(),
        getDaysUntilReorder(item).toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'reorder_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Reorder Report</CardTitle>
          <div className="flex gap-4">
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="critical">Critical/Out of Stock</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
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
        <div className="mb-4">
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right">Threshold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Reorder Quantity</TableHead>
                <TableHead className="text-right">Lead Time</TableHead>
                <TableHead className="text-right">Days Until Reorder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const status = getStockStatus(item);
                const daysUntilReorder = getDaysUntilReorder(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.name}
                      {status !== 'In Stock' && (
                        <AlertTriangle className="h-4 w-4 inline ml-2 text-yellow-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.lowStockThreshold}</TableCell>
                    <TableCell className={getStatusColor(status)}>{status}</TableCell>
                    <TableCell className="text-right">{item.reorderQuantity}</TableCell>
                    <TableCell className="text-right">{item.leadTime} days</TableCell>
                    <TableCell className="text-right">
                      {daysUntilReorder === Infinity ? '∞' : daysUntilReorder}
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

export default ReorderReport;