import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { PurchaseOrder, Supplier } from '../types';
import { format } from 'date-fns';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase';

interface PurchaseOrderListProps {
    orders: PurchaseOrder[];
    onSelect?: (order: PurchaseOrder) => void;
  }
  
  const PurchaseOrderList: React.FC<PurchaseOrderListProps> = ({ orders, onSelect }) => {
    const [suppliers, setSuppliers] = React.useState<Record<string, Supplier>>({});
  
    React.useEffect(() => {
      // Changed to use suppliers collection from Purchase module
      const q = query(collection(db, 'suppliers'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const suppliersData = snapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() } as Supplier;
          return acc;
        }, {} as Record<string, Supplier>);
        setSuppliers(suppliersData);
      });
  
      return () => unsubscribe();
    }, []);
  
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSelect?.(order)}
              >
                <TableCell>{order.poNumber}</TableCell>
                <TableCell>{suppliers[order.supplierId]?.name || 'Loading...'}</TableCell>
                <TableCell>{format(order.orderDate, 'MMM d, yyyy')}</TableCell>
                <TableCell>{format(order.expectedDeliveryDate, 'MMM d, yyyy')}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={
                    order.status === 'completed' ? 'default' :
                    order.status === 'cancelled' ? 'destructive' :
                    'secondary'
                  }>
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  export default PurchaseOrderList;