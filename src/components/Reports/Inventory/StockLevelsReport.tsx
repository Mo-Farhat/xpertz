import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Download, AlertTriangle } from 'lucide-react';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  lowStockThreshold: number;
  manufacturer: string;
  category: string;
  lastRestockDate: Date;
}

const StockLevelsReport = () => {
  const { tenant } = useTenant();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'low-stock' | 'out-of-stock'>('all');

  useEffect(() => {
    const fetchStockData = async () => {
      if (!tenant) return;

      try {
        const stockQuery = query(collection(db, 'inventory'));
        const snapshot = await getDocs(stockQuery);
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastRestockDate: doc.data().lastRestockDate?.toDate() || new Date()
        })) as StockItem[];
        
        setStockItems(items);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
  }, [tenant]);

  const handleExport = () => {
    const csvContent = [
      ['Item Name', 'Quantity', 'Low Stock Threshold', 'Status', 'Manufacturer', 'Category', 'Last Restock Date'],
      ...filteredItems.map(item => [
        item.name,
        item.quantity.toString(),
        item.lowStockThreshold.toString(),
        getStockStatus(item),
        item.manufacturer || 'N/A',
        item.category || 'N/A',
        item.lastRestockDate.toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'stock_levels_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStockStatus = (item: StockItem) => {
    if (item.quantity === 0) return 'Out of Stock';
    if (item.quantity <= item.lowStockThreshold) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Out of Stock':
        return 'text-red-500';
      case 'Low Stock':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const filteredItems = stockItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      switch (filterBy) {
        case 'low-stock':
          return matchesSearch && item.quantity <= item.lowStockThreshold && item.quantity > 0;
        case 'out-of-stock':
          return matchesSearch && item.quantity === 0;
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => {
      // Sort by stock status priority: Out of Stock > Low Stock > In Stock
      const statusA = getStockStatus(a);
      const statusB = getStockStatus(b);
      if (statusA === statusB) return a.name.localeCompare(b.name);
      if (statusA === 'Out of Stock') return -1;
      if (statusB === 'Out of Stock') return 1;
      if (statusA === 'Low Stock') return -1;
      if (statusB === 'Low Stock') return 1;
      return 0;
    });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Stock Levels Report</CardTitle>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Restock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const status = getStockStatus(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.name}
                      {status !== 'In Stock' && (
                        <AlertTriangle className="h-4 w-4 inline ml-2 text-yellow-500" />
                      )}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className={getStatusColor(status)}>{status}</TableCell>
                    <TableCell>{item.manufacturer || 'N/A'}</TableCell>
                    <TableCell>{item.category || 'N/A'}</TableCell>
                    <TableCell>{item.lastRestockDate.toLocaleDateString()}</TableCell>
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

export default StockLevelsReport;