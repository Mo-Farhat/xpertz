import React, { useState, useEffect } from 'react';
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Textarea } from "../../../ui/textarea";
import { useToast } from "../../../hooks/use-toast";
import { createLoanRequest } from "../../../services/loanService";
import { useAuth } from "../../../../contexts/AuthContext";
import { LoanRequest } from "../../../../types/loan";
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { format } from 'date-fns';

const LoanRequests: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [repaymentPeriod, setRepaymentPeriod] = useState("");
  const [requestedDate, setRequestedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [myRequests, setMyRequests] = useState<LoanRequest[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'loanRequests'), where('employeeId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LoanRequest));
      setMyRequests(requests);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createLoanRequest({
        employeeId: user.uid,
        employeeName: user.email || 'Unknown',
        amount: Number(amount),
        purpose,
        repaymentPeriod: Number(repaymentPeriod),
        requestedDate
      });

      setAmount("");
      setPurpose("");
      setRepaymentPeriod("");
      setRequestedDate(format(new Date(), 'yyyy-MM-dd'));

      toast({
        title: "Success",
        description: "Your loan request has been submitted for approval."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit loan request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Loan Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Loan Amount</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Purpose</label>
              <Textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Describe the purpose of the loan"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Preferred Repayment Period (months)</label>
              <Input
                type="number"
                value={repaymentPeriod}
                onChange={(e) => setRepaymentPeriod(e.target.value)}
                min="1"
                max="60"
                placeholder="Enter number of months"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Requested Date</label>
              <Input
                type="date"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit">Submit Request</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Loan Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active loan requests</p>
            ) : (
              myRequests.map((request) => (
                <div key={request.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Amount: ${request.amount}</p>
                      <p className="text-sm text-gray-600">Purpose: {request.purpose}</p>
                      <p className="text-sm text-gray-600">Requested Date: {request.requestedDate}</p>
                      <p className="text-sm text-gray-600">
                        Status: <span className="capitalize">{request.status}</span>
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(request.createdAt.toDate(), 'PPP')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanRequests;