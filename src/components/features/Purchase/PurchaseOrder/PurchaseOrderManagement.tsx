import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Button } from "../../../../components/ui/button";
import { useToast } from "../../../hooks/use-toast";
import { PurchaseOrder } from './types/purchaseOrderTypes';
import PurchaseOrderForm from './PurchaseOrderForm';
import PurchaseOrderList from './PurchaseOrderList';
import { EventProvider } from '../../Calendar/EventContext';

const PurchaseOrderManagement = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const q = query(collection(db, 'purchaseOrders'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const ordersData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            poNumber: data.poNumber,
            supplierId: data.supplierId,
            orderDate: data.orderDate?.toDate(),
            expectedDeliveryDate: data.expectedDeliveryDate?.toDate(),
            status: data.status,
            items: data.items,
            totalAmount: data.totalAmount,
            terms: data.terms,
            notes: data.notes,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate()
          } as PurchaseOrder;
        });
        setPurchaseOrders(ordersData);
      } catch (error) {
        console.error('Error processing purchase orders:', error);
        toast({
          title: "Error",
          description: "Failed to process purchase orders data",
          variant: "destructive",
        });
      }
    });

    return () => unsubscribe();
  }, [toast]);

  const handleOrderSubmit = (order: PurchaseOrder) => {
    setShowForm(false);
    toast({
      title: "Success",
      description: "Purchase order created successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Purchase Orders</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'View Orders' : 'Create New PO'}
        </Button>
      </div>

      {showForm ? (
        <EventProvider>
          <PurchaseOrderForm onSubmit={handleOrderSubmit} />
        </EventProvider>
      ) : (
        <PurchaseOrderList 
          orders={purchaseOrders}
          onSelect={(order) => console.log('Selected order:', order)}
        />
      )}
    </div>
  );
};

export default PurchaseOrderManagement;