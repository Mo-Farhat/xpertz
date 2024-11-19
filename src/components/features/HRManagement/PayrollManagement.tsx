import React, { useState, useEffect } from 'react';
import { useToast } from "../../hooks/use-toast";
import { Employee, PayrollRecord } from './types';
import PayrollForm from './PayrollManagement/PayrollForm';
import PayrollTable from './PayrollManagement/PayrollTable';
import { Button } from '../../../components/ui/button';
import { Download } from 'lucide-react';
import { generatePayrollRecord, fetchEmployees, subscribeToPayrollRecords } from './PayrollManagement/PayrollService';

const PayrollManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const fetchedEmployees = await fetchEmployees();
        setEmployees(fetchedEmployees);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load employees",
          variant: "destructive",
        });
      }
    };

    loadEmployees();

    // Subscribe to payroll records
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const unsubscribe = subscribeToPayrollRecords(
      startDate,
      new Date(),
      (records) => setPayrollRecords(records)
    );

    return () => unsubscribe();
  }, [toast]);

  const handleGeneratePayroll = async (
    employeeId: string, 
    overtime: number, 
    bonuses: number,
    deductions: number
  ) => {
    setIsLoading(true);
    try {
      const employee = employees.find(emp => emp.id === employeeId);
      if (!employee) throw new Error("Employee not found");

      const currentDate = new Date();
      const payPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      
      await generatePayrollRecord(employee, payPeriod, overtime, bonuses, deductions);
      
      toast({
        title: "Success",
        description: "Payroll record generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate payroll record",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Employee Name', 'Pay Period', 'Basic Salary', 'Overtime', 'Benefits', 'Deductions', 'Net Salary', 'Status'].join(','),
      ...payrollRecords.map(record => [
        record.employeeName,
        record.payPeriod,
        record.basicSalary,
        record.overtime,
        record.benefits,
        record.deductions,
        record.netSalary,
        record.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payroll_records_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payroll Management</h2>
        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Records
        </Button>
      </div>

      <PayrollForm 
        employees={employees}
        onSubmit={handleGeneratePayroll}
        isLoading={isLoading}
      />

      <PayrollTable 
        records={payrollRecords}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PayrollManagement;