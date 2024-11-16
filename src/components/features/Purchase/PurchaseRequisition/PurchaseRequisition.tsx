import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useAuth } from '../../../../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { useToast } from "../../../hooks/use-toast";
import { PurchaseRequisition as PurchaseRequisitionType } from '../types';
import PurchaseRequisitionForm from './PurchaseRequisitionForm';
import PurchaseRequisitionList from './PurchaseRequisitionList';

const PurchaseRequisition = () => {
  const [requisitions, setRequisitions] = useState<PurchaseRequisitionType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/purchaseRequisitions`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requisitionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateRequired: doc.data().dateRequired?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as PurchaseRequisitionType[];
      setRequisitions(requisitionsData);
    }, (error) => {
      console.error('Error fetching requisitions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch requisitions",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleSubmit = async (formData: {
    department: string;
    dateRequired: Date;
    items: any[];
  }) => {
    if (!user) return;

    try {
      const totalAmount = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
      
      const requisitionData = {
        requestNumber: `REQ-${Date.now()}`,
        requestedBy: user.email,
        department: formData.department,
        dateRequired: formData.dateRequired,
        status: 'pending' as const,
        items: formData.items,
        totalAmount,
        createdAt: new Date(),
      };

      await addDoc(collection(db, `users/${user.uid}/purchaseRequisitions`), {
        ...requisitionData,
        dateRequired: Timestamp.fromDate(requisitionData.dateRequired),
        createdAt: Timestamp.fromDate(requisitionData.createdAt)
      });

      toast({
        title: "Success",
        description: "Purchase requisition created successfully",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating requisition:', error);
      toast({
        title: "Error",
        description: "Failed to create requisition",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (requisitionId: string, newStatus: 'approved' | 'rejected') => {
    if (!user) return;

    try {
      const requisitionRef = doc(db, `users/${user.uid}/purchaseRequisitions`, requisitionId);
      await updateDoc(requisitionRef, {
        status: newStatus,
        updatedAt: Timestamp.fromDate(new Date())
      });

      toast({
        title: "Success",
        description: `Requisition ${newStatus} successfully`,
      });
    } catch (error) {
      console.error('Error updating requisition status:', error);
      toast({
        title: "Error",
        description: "Failed to update requisition status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Purchase Requisitions</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Requisition</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create Purchase Requisition</DialogTitle>
            </DialogHeader>
            <PurchaseRequisitionForm onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <PurchaseRequisitionList 
          requisitions={requisitions}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};

export default PurchaseRequisition;