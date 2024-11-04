import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import EmployeeInfoReport from './HR/EmployeeInfoReport';
import PayrollFinancialReport from './HR/PayrollFinancialReport';
const HRReports = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">HR Reports</h2>
      
      <Tabs defaultValue="employee-info" className="w-full">
        <TabsList>
          <TabsTrigger value="employee-info">Employee Information</TabsTrigger>
          <TabsTrigger value="payroll">Payroll & Financial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employee-info">
          <EmployeeInfoReport />
        </TabsContent>
        <TabsContent value="payroll">
          <PayrollFinancialReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default HRReports;