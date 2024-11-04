import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Download } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface BackorderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  orderDate: Date;
  expectedDate: Date;
  supplier: string;
  status: 'pending' | 'partial' | 'in-transit';
  customerOrderId?: string;
  customerName?: string;
  priority: 'low' | 'medium' | 'high';
}

const BackorderReport = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [backorders, setBackorders] = useState<BackorderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'partial' | 'in-transit'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    const fetchBackorders = async () => {
      if (!tenant) return;
      
      try {
        setLoading(true);
        const backordersRef = collection(db, 'backorders');
        const q = query(
          backordersRef,
          orderBy('orderDate', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const backorderData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          orderDate: doc.data().orderDate.toDate(),
          expectedDate: doc.data().expectedDate.toDate()
        })) as BackorderItem[];

        setBackorders(backorderData.filter(item => 
          (statusFilter === 'all' || item.status === statusFilter) &&
          (priorityFilter === 'all' || item.priority === priorityFilter)
        ));
      } catch (error) {
        console.error('Error fetching backorders:', error);
        toast({
          title: "Error",
          description: "Failed to load backorder data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBackorders();
  }, [tenant, statusFilter, priorityFilter, toast]);

  const handleExport = () => {
    const csvContent = [
      ['Product Name', 'Quantity', 'Order Date', 'Expected Date', 'Supplier', 'Status', 'Customer', 'Priority'],
      ...backorders.map(item => [
        item.productName,
        item.quantity.toString(),
        item.orderDate.toLocaleDateString(),
        item.expectedDate.toLocaleDateString(),
        item.supplier,
        item.status,
        item.customerName || 'N/A',
        item.priority
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'backorder_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-red-500';
      case 'partial': return 'text-yellow-500';
      case 'in-transit': return 'text-green-500';
      default: return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 font-bold';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Backorder Report</CardTitle>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
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
                <TableHead>Product Name</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backorders.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell>{item.orderDate.toLocaleDateString()}</TableCell>
                  <TableCell>{item.expectedDate.toLocaleDateString()}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell className={getStatusColor(item.status)}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </TableCell>
                  <TableCell>{item.customerName || 'N/A'}</TableCell>
                  <TableCell className={getPriorityColor(item.priority)}>
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackorderReport;