import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useToast } from "../../../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import ChequeForm from './ChequeForm';
import ChequeTable from './ChequeTable';
import { Cheque } from './types';const ChequeManagement = () => {
    const [cheques, setCheques] = useState<Cheque[]>([]);
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const q = query(collection(db, 'cheques'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chequeData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate()
        } as Cheque));
        setCheques(chequeData);
        setIsLoading(false);
      }, (error) => {
        console.error('Error fetching cheques:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load cheques"
        });
        setIsLoading(false);
      });
  
      return () => unsubscribe();
    }, [toast]);
  
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cheque Management</CardTitle>
          </CardHeader>
          <CardContent>
            <ChequeForm />
            <div className="mt-6">
              <ChequeTable cheques={cheques} isLoading={isLoading} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default ChequeManagement;

