import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { NewQuotationContract } from './types';
import { useToast } from "../../../hooks/use-toast";

export const useQuotationOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddDocument = async (newDocument: NewQuotationContract) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'quotationsContracts'), {
        ...newDocument,
        createdAt: new Date(),
        lastModified: new Date()
      });
      
      toast({
        title: "Success",
        description: "Document created successfully",
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDocument = async (id: string, document: Partial<NewQuotationContract>) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'quotationsContracts', id), {
        ...document,
        lastModified: new Date()
      });
      
      toast({
        title: "Success",
        description: "Document updated successfully",
      });
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'quotationsContracts', id));
      
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleAddDocument,
    handleUpdateDocument,
    handleDeleteDocument,
    loading
  };
};