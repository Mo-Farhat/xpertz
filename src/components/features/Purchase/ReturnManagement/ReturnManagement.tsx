import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useAuth } from '../../../../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { useToast } from "../../../hooks/use-toast";
import { PurchaseReturn, ReturnFormData } from './types';
import ReturnForm from './ReturnForm';
import ReturnList from './ReturnList';

const ReturnManagement = () => {
  const [returns, setReturns] = useState<PurchaseReturn[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/purchaseReturns`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const returnsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        returnDate: doc.data().returnDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as PurchaseReturn[];
      setReturns(returnsData);
    }, (error) => {
      console.error('Error fetching returns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch returns",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleSubmit = async (formData: ReturnFormData) => {
    if (!user) return;

    try {
      const returnData = {
        ...formData,
        returnDate: new Date(),
        createdAt: new Date(),
        status: 'pending' as const,
        items: [] // Initialize empty items array
      };

      await addDoc(collection(db, `users/${user.uid}/purchaseReturns`), {
        ...returnData,
        returnDate: Timestamp.fromDate(returnData.returnDate),
        createdAt: Timestamp.fromDate(returnData.createdAt)
      });

      toast({
        title: "Success",
        description: "Return created successfully",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating return:', error);
      toast({
        title: "Error",
        description: "Failed to create return",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (returnId: string, newStatus: 'approved' | 'rejected') => {
    if (!user) return;

    try {
      const returnRef = doc(db, `users/${user.uid}/purchaseReturns`, returnId);
      await updateDoc(returnRef, {
        status: newStatus,
        updatedAt: Timestamp.fromDate(new Date())
      });

      toast({
        title: "Success",
        description: `Return ${newStatus} successfully`,
      });
    } catch (error) {
      console.error('Error updating return status:', error);
      toast({
        title: "Error",
        description: "Failed to update return status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Return Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Return</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Return</DialogTitle>
            </DialogHeader>
            <ReturnForm onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <ReturnList 
          returns={returns}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};

export default ReturnManagement;