import React, { useState, useEffect } from 'react';
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { useToast } from "../../../hooks/use-toast";
import { approveLoanRequest, rejectLoanRequest } from "../../../services/loanService";
import { LoanRequest } from "../../../../types/loan";
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../../firebase';

const LoanApprovals: React.FC = () => {
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<LoanRequest[]>([]);
  const [interestRate, setInterestRate] = useState<number>(5);

  useEffect(() => {
    const q = query(collection(db, 'loanRequests'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LoanRequest));
      setPendingRequests(requests);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (requestId: string) => {
    try {
      await approveLoanRequest(requestId, interestRate);
      toast({
        title: "Success",
        description: "Loan request has been approved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve loan request.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectLoanRequest(requestId);
      toast({
        title: "Success",
        description: "Loan request has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject loan request.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Loan Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending loan approvals</p>
          ) : (
            pendingRequests.map((request) => (
              <div key={request.id} className="border p-4 rounded-lg space-y-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{request.employeeName}</p>
                    <p className="text-sm text-gray-600">Amount: ${request.amount}</p>
                    <p className="text-sm text-gray-600">Period: {request.repaymentPeriod} months</p>
                    <p className="text-sm text-gray-600">Purpose: {request.purpose}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {request.createdAt.toDate().toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Interest Rate (%)</label>
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(request.id)}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanApprovals;