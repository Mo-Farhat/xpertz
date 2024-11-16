import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Download, Edit, Trash2 } from 'lucide-react';
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import ReturnMetrics from './ReturnRefund/ReturnMetrics';
import ReturnForm from './ReturnRefund/ReturnForm';
import { ReturnRefund } from './ReturnRefund/types';

const ReturnsRefunds: React.FC = () => {
  const { toast } = useToast();
  const [returnsRefunds, setReturnsRefunds] = useState<ReturnRefund[]>([]);
  const [newReturnRefund, setNewReturnRefund] = useState<Omit<ReturnRefund, 'id' | 'createdAt'>>({
    orderId: '',
    customerName: '',
    reason: '',
    status: 'pending',
    amount: 0,
    requestDate: new Date(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'returnsRefunds'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const returnsRefundsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        requestDate: doc.data().requestDate.toDate(),
        processedDate: doc.data().processedDate?.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      } as ReturnRefund));
      setReturnsRefunds(returnsRefundsData);
    });
    return unsubscribe;
  }, []);

  const handleAddReturnRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'returnsRefunds'), {
        ...newReturnRefund,
        createdAt: new Date(),
      });
      setNewReturnRefund({
        orderId: '',
        customerName: '',
        reason: '',
        status: 'pending',
        amount: 0,
        requestDate: new Date(),
      });
      toast({
        title: "Success",
        description: "Return/Refund request created successfully",
      });
    } catch (error) {
      console.error("Error adding return/refund: ", error);
      toast({
        title: "Error",
        description: "Failed to create return/refund request",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReturnRefund = async (id: string, updatedReturnRefund: Partial<ReturnRefund>) => {
    try {
      await updateDoc(doc(db, 'returnsRefunds', id), updatedReturnRefund);
      setEditingId(null);
      toast({
        title: "Success",
        description: "Return/Refund request updated successfully",
      });
    } catch (error) {
      console.error("Error updating return/refund: ", error);
      toast({
        title: "Error",
        description: "Failed to update return/refund request",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReturnRefund = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this return/refund request?')) return;
    
    try {
      await deleteDoc(doc(db, 'returnsRefunds', id));
      toast({
        title: "Success",
        description: "Return/Refund request deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting return/refund: ", error);
      toast({
        title: "Error",
        description: "Failed to delete return/refund request",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const headers = ['Order ID', 'Customer Name', 'Reason', 'Status', 'Amount', 'Request Date', 'Processed Date', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...returnsRefunds.map(returnRefund => 
        `${returnRefund.orderId},${returnRefund.customerName},${returnRefund.reason},${returnRefund.status},${returnRefund.amount},${returnRefund.requestDate.toISOString()},${returnRefund.processedDate?.toISOString() || ''},${returnRefund.createdAt.toISOString()}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'returns_refunds.csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadgeVariant = (status: ReturnRefund['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'processed': return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Returns and Refunds</h3>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <ReturnMetrics data={returnsRefunds} />
      
      <ReturnForm
        returnRefund={newReturnRefund}
        onSubmit={handleAddReturnRefund}
        onChange={setNewReturnRefund}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {returnsRefunds.map((returnRefund) => (
            <TableRow key={returnRefund.id}>
              <TableCell>{returnRefund.orderId}</TableCell>
              <TableCell>{returnRefund.customerName}</TableCell>
              <TableCell>{returnRefund.reason}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(returnRefund.status)}>
                  {returnRefund.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">${returnRefund.amount.toFixed(2)}</TableCell>
              <TableCell>{returnRefund.requestDate.toLocaleDateString()}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingId(returnRefund.id)}
                  className="mr-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteReturnRefund(returnRefund.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReturnsRefunds;