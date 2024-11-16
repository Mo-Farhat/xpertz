import React, { useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { RFQ } from '../types';
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
import RFQForm from './RFQForm';

const RFQManagement = () => {
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const q = query(collection(db, 'rfqs'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rfqsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as RFQ));
      setRFQs(rfqsData);
    }, (error) => {
      console.error('Error fetching RFQs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch RFQs",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Request for Quotations</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Create New RFQ'}
        </Button>
      </div>

      {showForm && <RFQForm />}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RFQ Number</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Suppliers</TableHead>
              <TableHead>Items</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rfqs.map((rfq) => (
              <TableRow key={rfq.id}>
                <TableCell>{rfq.rfqNumber}</TableCell>
                <TableCell>
                  {new Date(rfq.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    rfq.status === 'completed' ? 'default' :
                    rfq.status === 'draft' ? 'secondary' :
                    'destructive'
                  }>
                    {rfq.status}
                  </Badge>
                </TableCell>
                <TableCell>{rfq.suppliers.length} suppliers</TableCell>
                <TableCell>{rfq.items.length} items</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RFQManagement;