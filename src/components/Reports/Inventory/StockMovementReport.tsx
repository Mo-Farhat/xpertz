import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { DateRangePicker } from '../../ui/date-range-picker';
import { addDays, format } from 'date-fns';

interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'inflow' | 'outflow';
  quantity: number;
  reason: string;
  date: Date;
  reference: string;
}

const StockMovementReport = () => {
  const { tenant } = useTenant();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date()
  });
  const [movementType, setMovementType] = useState<'all' | 'inflow' | 'outflow'>('all');

  useEffect(() => {
    const fetchMovements = async () => {
      if (!tenant) return;

      try {
        const baseQuery = query(
          collection(db, 'inventory-movements'),
          where('date', '>=', Timestamp.fromDate(dateRange.from)),
          where('date', '<=', Timestamp.fromDate(dateRange.to)),
          orderBy('date', 'desc')
        );

        const snapshot = await getDocs(baseQuery);
        const movementsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        })) as StockMovement[];

        setMovements(movementsData.filter(movement => 
          movementType === 'all' ? true : movement.type === movementType
        ));
      } catch (error) {
        console.error('Error fetching stock movements:', error);
      }
    };

    fetchMovements();
  }, [tenant, dateRange, movementType]);

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Item Name', 'Type', 'Quantity', 'Reason', 'Reference'],
      ...movements.map(movement => [
        format(movement.date, 'yyyy-MM-dd HH:mm'),
        movement.itemName,
        movement.type,
        movement.quantity.toString(),
        movement.reason,
        movement.reference
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'stock_movements.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getMovementIcon = (type: 'inflow' | 'outflow') => {
    return type === 'inflow' 
      ? <ArrowUpRight className="h-4 w-4 text-green-500" />
      : <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Stock Movement Report</CardTitle>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Select value={movementType} onValueChange={(value: any) => setMovementType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Movement type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Movements</SelectItem>
              <SelectItem value="inflow">Inflow Only</SelectItem>
              <SelectItem value="outflow">Outflow Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{format(movement.date, 'MMM dd, yyyy HH:mm')}</TableCell>
                  <TableCell className="font-medium">{movement.itemName}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {getMovementIcon(movement.type)}
                    <span className={movement.type === 'inflow' ? 'text-green-600' : 'text-red-600'}>
                      {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.reason}</TableCell>
                  <TableCell>{movement.reference}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockMovementReport;