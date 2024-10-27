import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { format } from 'date-fns';
import { useToast } from "../components/hooks/use-toast";
import { Loader2 } from 'lucide-react';

interface HirePurchaseAgreement {
  id: string;
  customerId: string;
  customerName: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  downPayment: number;
  amountFinanced: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  startDate: Date;
  endDate: Date;
  payments: Array<{
    id: string;
    amount: number;
    dueDate: Date;
    status: 'pending' | 'paid' | 'overdue';
  }>;
  status: 'active' | 'completed' | 'defaulted';
  createdAt: Date;
  updatedAt: Date;
}

const HirePurchaseAgreements = () => {
  const [agreements, setAgreements] = useState<HirePurchaseAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'hirePurchaseAgreements'));
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        try {
          const agreementsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            
            // Convert Firestore timestamps to JavaScript Dates
            const processDate = (dateField: any) => {
              if (!dateField) return new Date();
              if (dateField instanceof Timestamp) return dateField.toDate();
              if (dateField.seconds) return new Date(dateField.seconds * 1000);
              return new Date(dateField);
            };

            return {
              id: doc.id,
              customerId: data.customerId || '',
              customerName: data.customerName || 'Unknown Customer',
              items: data.items || [],
              totalAmount: data.totalAmount || 0,
              downPayment: data.downPayment || 0,
              amountFinanced: data.amountFinanced || 0,
              interestRate: data.interestRate || 0,
              term: data.term || 0,
              monthlyPayment: data.monthlyPayment || 0,
              startDate: processDate(data.startDate),
              endDate: processDate(data.endDate),
              payments: (data.payments || []).map((payment: any) => ({
                ...payment,
                dueDate: processDate(payment.dueDate)
              })),
              status: data.status || 'active',
              createdAt: processDate(data.createdAt),
              updatedAt: processDate(data.updatedAt)
            } as HirePurchaseAgreement;
          });
          
          setAgreements(agreementsData);
        } catch (err) {
          console.error('Error processing agreements:', err);
          toast({
            title: "Error",
            description: "Failed to process agreements data",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching agreements:", err);
        toast({
          title: "Error",
          description: "Failed to fetch hire purchase agreements",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading agreements...</span>
      </div>
    );
  }

  if (!agreements || agreements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hire Purchase Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 text-center py-8">
            No hire purchase agreements found. Create a hire purchase agreement from the Point of Sale section.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hire Purchase Agreements ({agreements.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Monthly Payment</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agreements.map((agreement) => (
                <TableRow key={agreement.id}>
                  <TableCell>{agreement.customerName}</TableCell>
                  <TableCell>${agreement.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>${agreement.monthlyPayment.toFixed(2)}</TableCell>
                  <TableCell>{format(agreement.startDate, 'PP')}</TableCell>
                  <TableCell>{format(agreement.endDate, 'PP')}</TableCell>
                  <TableCell>
                    <Badge variant={
                      agreement.status === 'completed' ? 'default' :
                      agreement.status === 'defaulted' ? 'destructive' : 'outline'
                    }>
                      {agreement.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HirePurchaseAgreements;