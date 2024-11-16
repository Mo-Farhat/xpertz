import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { CheckCircle, XCircle } from 'lucide-react';
import { Expense } from './types';

const ExpenseApprovals: React.FC = () => {
    const [pendingExpenses, setPendingExpenses] = useState<Expense[]>([]);
    const { toast } = useToast();
  
    useEffect(() => {
      const q = query(
        collection(db, 'expenses'),
        where('status', '==', 'pending')
      );
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const expenses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          approvedAt: doc.data().approvedAt?.toDate(),
        } as Expense));
        setPendingExpenses(expenses);
      });
  
      return () => unsubscribe();
    }, []);
  
    const handleApproval = async (expenseId: string, approved: boolean) => {
      try {
        const expenseRef = doc(db, 'expenses', expenseId);
        await updateDoc(expenseRef, {
          status: approved ? 'approved' : 'rejected',
          approvedAt: new Date(),
        });
  
        toast({
          title: approved ? "Expense Approved" : "Expense Rejected",
          description: `The expense has been ${approved ? 'approved' : 'rejected'} successfully.`,
        });
      } catch (error) {
        console.error('Error updating expense status:', error);
        toast({
          title: "Error",
          description: "Failed to update expense status.",
          variant: "destructive",
        });
      }
    };
  
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Pending Approvals</h3>
        
        {pendingExpenses.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No pending expenses to approve
            </CardContent>
          </Card>
        ) : (
          pendingExpenses.map((expense) => (
            <Card key={expense.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{expense.description}</h4>
                    <p className="text-sm text-gray-500">{expense.category}</p>
                    <p className="text-sm text-gray-500">
                      Date: {expense.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${expense.amount.toFixed(2)}</p>
                    <Badge variant="secondary" className="mt-2">
                      {expense.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleApproval(expense.id, true)}
                    className="flex items-center gap-2"
                    variant="default"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleApproval(expense.id, false)}
                    className="flex items-center gap-2"
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };
  
  export default ExpenseApprovals;