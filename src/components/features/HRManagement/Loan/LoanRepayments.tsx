import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Progress } from "../../../ui/progress";
import { Button } from "../../../ui/button";
import { LoanAgreement } from "../../../../types/loan";
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useAuth } from "../../../../contexts/AuthContext";
import { recordLoanPayment } from "../../../services/loanService";
import { useToast } from "../../../hooks/use-toast";

const LoanRepayments: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeLoans, setActiveLoans] = useState<LoanAgreement[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'loanAgreements'),
      where('employeeId', '==', user.uid),
      where('status', '==', 'approved')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LoanAgreement));
      setActiveLoans(loans);
    });

    return () => unsubscribe();
  }, [user]);

  const handlePayment = async (agreementId: string, paymentId: string) => {
    try {
      await recordLoanPayment(agreementId, paymentId);
      toast({
        title: "Success",
        description: "Payment recorded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record payment.",
        variant: "destructive",
      });
    }
  };

  const calculateProgress = (loan: LoanAgreement) => {
    const paidPayments = loan.payments.filter(p => p.status === 'paid').length;
    return (paidPayments / loan.payments.length) * 100;
  };

  return (
    <div className="space-y-6">
      {activeLoans.map((loan) => (
        <Card key={loan.id}>
          <CardHeader>
            <CardTitle>Loan #{loan.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Loan Amount: ${loan.totalAmount.toFixed(2)}</span>
                  <span>
                    Remaining: $
                    {(loan.totalAmount -
                      loan.payments.filter(p => p.status === 'paid').length * loan.monthlyPayment
                    ).toFixed(2)}
                  </span>
                </div>
                <Progress value={calculateProgress(loan)} />
                <div className="text-sm text-gray-500">
                  Monthly Payment: ${loan.monthlyPayment.toFixed(2)}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Payment Schedule</h4>
                {loan.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <div>
                      <p className="text-sm">
                        Due: {payment.dueDate.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: <span className="capitalize">{payment.status}</span>
                      </p>
                    </div>
                    {payment.status === 'pending' && (
                      <Button
                        onClick={() => handlePayment(loan.id, payment.id)}
                        size="sm"
                      >
                        Record Payment
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {activeLoans.length === 0 && (
        <Card>
          <CardContent>
            <p className="text-gray-500 text-center py-4">No active loans found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LoanRepayments;