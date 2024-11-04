import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Card, CardContent } from "../../ui/card";
import LoanRequests from './Loan/LoanRequests';
import LoanApprovals from './Loan/LoanApprovals';
import LoanRepayments from './Loan/LoanRepayments';
import LoanReports from './Loan/LoanReports';
import { useToast } from "../../hooks/use-toast";

class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  onError: (error: Error) => void;
}> {
  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    return this.props.children;
  }
}

const LoanManagement = () => {
  const { toast } = useToast();

  const handleError = (error: any) => {
    toast({
      title: "Error",
      description: "Failed to load loan management. Please try again.",
      variant: "destructive",
    });
    console.error('Loan management error:', error);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Employee Loan Management</h3>
      
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="requests">Loan Requests</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="repayments">Repayments</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests">
              <ErrorBoundary onError={handleError}>
                <LoanRequests />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="approvals">
              <ErrorBoundary onError={handleError}>
                <LoanApprovals />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="repayments">
              <ErrorBoundary onError={handleError}>
                <LoanRepayments />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="reports">
              <ErrorBoundary onError={handleError}>
                <LoanReports />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanManagement;