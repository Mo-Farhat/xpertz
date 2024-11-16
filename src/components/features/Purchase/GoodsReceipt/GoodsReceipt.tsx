import React, { useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { GoodsReceipt as GoodsReceiptType } from '../types';
import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { useToast } from "../../../hooks/use-toast";

const GoodsReceipt = () => {
  const [receipts, setReceipts] = useState<GoodsReceiptType[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    const q = query(collection(db, 'goodsReceipts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const receiptsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as GoodsReceiptType));
      setReceipts(receiptsData);
    }, (error) => {
      console.error('Error fetching receipts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch goods receipts",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Goods Receipt</h2>
        <Button>Record New Receipt</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt Number</TableHead>
              <TableHead>PO Number</TableHead>
              <TableHead>Received Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell>{receipt.receiptNumber}</TableCell>
                <TableCell>{receipt.poNumber}</TableCell>
                <TableCell>
                  {new Date(receipt.receivedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    receipt.status === 'completed' ? 'default' :
                    receipt.status === 'rejected' ? 'destructive' :
                    'secondary'
                  }>
                    {receipt.status}
                  </Badge>
                </TableCell>
                <TableCell>{receipt.items.length} items</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GoodsReceipt;