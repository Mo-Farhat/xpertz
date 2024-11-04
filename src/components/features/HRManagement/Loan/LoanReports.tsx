import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Download } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { LoanAgreement, LoanSummary } from '../../../../types/loan';
import { useToast } from "../../../hooks/use-toast";

const LoanReports: React.FC = () => {
  const [summary, setSummary] = useState<LoanSummary>({
    totalActiveLoans: 0,
    monthlyRepayments: 0,
    activeBorrowers: 0,
    totalLoanAmount: 0,
    totalRepaidAmount: 0,
    overduePayments: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const loansSnapshot = await getDocs(collection(db, 'loanAgreements'));
        const loans = loansSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as LoanAgreement));

        // Calculate active loans
        const activeLoans = loans.filter(loan => loan.status === 'active');
        
        // Calculate total loan amount
        const totalAmount = activeLoans.reduce((sum, loan) => sum + loan.totalAmount, 0);
        
        // Calculate monthly repayments
        const monthlyAmount = activeLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
        
        // Count unique borrowers
        const uniqueBorrowers = new Set(activeLoans.map(loan => loan.employeeId)).size;
        
        // Calculate total repaid amount and overdue payments
        let totalRepaid = 0;
        let overdueCount = 0;
        
        activeLoans.forEach(loan => {
          loan.payments.forEach(payment => {
            if (payment.status === 'paid') {
              totalRepaid += payment.amount;
            }
            if (payment.status === 'overdue') {
              overdueCount++;
            }
          });
        });

        setSummary({
          totalActiveLoans: totalAmount,
          monthlyRepayments: monthlyAmount,
          activeBorrowers: uniqueBorrowers,
          totalLoanAmount: totalAmount,
          totalRepaidAmount: totalRepaid,
          overduePayments: overdueCount
        });
      } catch (error) {
        console.error('Error fetching loan data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch loan data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanData();
  }, [toast]);

  const handleDownloadReport = async () => {
    try {
      const loansSnapshot = await getDocs(collection(db, 'loanAgreements'));
      const loans = loansSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LoanAgreement));

      // Create CSV content
      const csvContent = [
        ['Loan ID', 'Employee', 'Amount', 'Status', 'Start Date', 'End Date', 'Monthly Payment'].join(','),
        ...loans.map(loan => [
          loan.id,
          loan.employeeName || 'Unknown',
          loan.totalAmount.toFixed(2),
          loan.status,
          new Date(loan.startDate).toLocaleDateString(),
          new Date(loan.endDate).toLocaleDateString(),
          loan.monthlyPayment.toFixed(2)
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `loan-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Report downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loan Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">${summary.totalActiveLoans.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Total Active Loans</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">${summary.monthlyRepayments.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Monthly Repayments</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{summary.activeBorrowers}</div>
                  <div className="text-sm text-gray-500">Active Borrowers</div>
                </CardContent>
              </Card>
            </div>
            
            <Button className="w-full" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Download Detailed Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanReports;