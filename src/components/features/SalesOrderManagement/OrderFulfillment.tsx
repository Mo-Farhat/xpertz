import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Download, Edit, Trash2 } from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { useToast } from "../../hooks/use-toast";
import { FulfillmentOrder } from './OrderFulfillment/types';
import FulfillmentMetrics from './OrderFulfillment/FulfillmentMetrics';
import FulfillmentForm from './OrderFulfillment/FulfillmentForm';

const OrderFulfillment: React.FC = () => {
  const [fulfillments, setFulfillments] = useState<FulfillmentOrder[]>([]);
  const [newFulfillment, setNewFulfillment] = useState<Omit<FulfillmentOrder, 'id' | 'createdAt'>>({
    orderId: '',
    customerName: '',
    status: 'pending',
    shippingMethod: '',
    trackingNumber: '',
    estimatedDeliveryDate: new Date(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'orderFulfillments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fulfillmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        estimatedDeliveryDate: doc.data().estimatedDeliveryDate.toDate(),
        actualDeliveryDate: doc.data().actualDeliveryDate?.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      } as FulfillmentOrder));
      setFulfillments(fulfillmentsData);
    });
    return unsubscribe;
  }, []);

  const handleAddFulfillment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'orderFulfillments'), {
        ...newFulfillment,
        createdAt: new Date(),
      });
      setNewFulfillment({
        orderId: '',
        customerName: '',
        status: 'pending',
        shippingMethod: '',
        trackingNumber: '',
        estimatedDeliveryDate: new Date(),
      });
      toast({
        title: "Success",
        description: "Fulfillment added successfully",
      });
    } catch (error) {
      console.error("Error adding fulfillment: ", error);
      toast({
        title: "Error",
        description: "Failed to add fulfillment",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFulfillment = async (id: string, updatedFulfillment: Partial<FulfillmentOrder>) => {
    try {
      await updateDoc(doc(db, 'orderFulfillments', id), updatedFulfillment);
      setEditingId(null);
      toast({
        title: "Success",
        description: "Fulfillment updated successfully",
      });
    } catch (error) {
      console.error("Error updating fulfillment: ", error);
      toast({
        title: "Error",
        description: "Failed to update fulfillment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFulfillment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this fulfillment?')) return;
    
    try {
      await deleteDoc(doc(db, 'orderFulfillments', id));
      toast({
        title: "Success",
        description: "Fulfillment deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting fulfillment: ", error);
      toast({
        title: "Error",
        description: "Failed to delete fulfillment",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const headers = ['Order ID', 'Customer Name', 'Status', 'Shipping Method', 'Tracking Number', 'Est. Delivery Date', 'Actual Delivery Date', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...fulfillments.map(f => 
        `${f.orderId},${f.customerName},${f.status},${f.shippingMethod},${f.trackingNumber},${f.estimatedDeliveryDate.toISOString()},${f.actualDeliveryDate?.toISOString() || ''},${f.createdAt.toISOString()}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'order_fulfillments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Fulfillment</h2>
        <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <FulfillmentMetrics orders={fulfillments} />
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Create New Fulfillment</h3>
        <FulfillmentForm
          fulfillment={newFulfillment}
          onFulfillmentChange={setNewFulfillment}
          onSubmit={handleAddFulfillment}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Shipping Method</TableHead>
              <TableHead>Tracking Number</TableHead>
              <TableHead>Est. Delivery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fulfillments.map((fulfillment) => (
              <TableRow key={fulfillment.id}>
                <TableCell>{fulfillment.orderId}</TableCell>
                <TableCell>{fulfillment.customerName}</TableCell>
                <TableCell>
                  <Badge variant={
                    fulfillment.status === 'pending' ? 'secondary' :
                    fulfillment.status === 'processing' ? 'default' :
                    fulfillment.status === 'shipped' ? 'default' :
                    'success'
                  }>
                    {fulfillment.status}
                  </Badge>
                </TableCell>
                <TableCell>{fulfillment.shippingMethod}</TableCell>
                <TableCell>{fulfillment.trackingNumber}</TableCell>
                <TableCell>{fulfillment.estimatedDeliveryDate.toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(fulfillment.id)}
                    className="mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFulfillment(fulfillment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderFulfillment;