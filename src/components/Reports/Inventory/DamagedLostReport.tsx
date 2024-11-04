import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Download } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { DateRangePicker } from '../../ui/date-range-picker';
import { addDays } from 'date-fns';

interface LostItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  reason: 'damage' | 'theft' | 'expiry' | 'other';
  description: string;
  date: Date;
  costPrice: number;
  totalLoss: number;
  location: string;
  reportedBy: string;
}

const DamagedLostReport = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date()
  });
  const [reasonFilter, setReasonFilter] = useState<'all' | 'damage' | 'theft' | 'expiry' | 'other'>('all');

  useEffect(() => {
    const fetchLostItems = async () => {
      if (!tenant) return;
      
      try {
        setLoading(true);
        const lostItemsRef = collection(db, 'inventory-losses');
        const q = query(
          lostItemsRef,
          where('date', '>=', Timestamp.fromDate(dateRange.from)),
          where('date', '<=', Timestamp.fromDate(dateRange.to)),
          orderBy('date', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const lostItemsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
          totalLoss: doc.data().quantity * doc.data().costPrice
        })) as LostItem[];

        setItems(lostItemsData.filter(item => 
          reasonFilter === 'all' ? true : item.reason === reasonFilter
        ));
      } catch (error) {
        console.error('Error fetching lost items:', error);
        toast({
          title: "Error",
          description: "Failed to load damaged and lost goods data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, [tenant, dateRange, reasonFilter, toast]);

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Item Name', 'Quantity', 'Reason', 'Description', 'Cost Price', 'Total Loss', 'Location', 'Reported By'],
      ...items.map(item => [
        item.date.toISOString().split('T')[0],
        item.itemName,
        item.quantity.toString(),
        item.reason,
        item.description,
        item.costPrice.toFixed(2),
        item.totalLoss.toFixed(2),
        item.location,
        item.reportedBy
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'damaged_lost_goods_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalLoss = items.reduce((sum, item) => sum + item.totalLoss, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Damaged & Lost Goods Report</CardTitle>
          <div className="flex gap-4">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
            />
            <Select value={reasonFilter} onValueChange={(value: any) => setReasonFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                <SelectItem value="damage">Damage</SelectItem>
                <SelectItem value="theft">Theft</SelectItem>
                <SelectItem value="expiry">Expiry</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 font-semibold">
            Total Loss Value: ${totalLoss.toFixed(2)}
          </p>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Cost Price</TableHead>
                <TableHead className="text-right">Total Loss</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Reported By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date.toLocaleDateString()}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="capitalize">{item.reason}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">${item.costPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.totalLoss.toFixed(2)}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.reportedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DamagedLostReport;