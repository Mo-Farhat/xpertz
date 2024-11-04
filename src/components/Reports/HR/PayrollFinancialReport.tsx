import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../../ui/button';
import { Download } from 'lucide-react';
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import PayrollSummaryMetrics from './components/PayrollSummaryMetrics';
import PayrollBreakdownTable from './components/PayrollBreakdownTable';
import { PayrollData } from './types';
const PayrollFinancialReport = () => {
  const { tenant } = useTenant();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [payrollData, setPayrollData] = useState<PayrollData>({
    totalPayroll: 0,
    departmentBreakdown: {},
    employeeCount: 0,
    averageSalary: 0,
    benefits: 0,
    taxes: 0,
    overtime: 0,
    bonuses: 0
  });
  useEffect(() => {
    const fetchPayrollData = async () => {
      if (!tenant) return;
      const now = new Date();
      let startDate = new Date();
      switch (timeRange) {
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      try {
        const payrollQuery = query(
          collection(db, `tenants/${tenant.id}/payroll`),
          where('date', '>=', Timestamp.fromDate(startDate)),
          where('date', '<=', Timestamp.fromDate(now))
        );
        const snapshot = await getDocs(payrollQuery);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Process payroll data
        const processedData: PayrollData = {
          totalPayroll: 0,
          departmentBreakdown: {},
          employeeCount: 0,
          averageSalary: 0,
          benefits: 0,
          taxes: 0,
          overtime: 0,
          bonuses: 0
        };
        data.forEach(entry => {
          processedData.totalPayroll += entry.amount;
          processedData.benefits += entry.benefits || 0;
          processedData.taxes += entry.taxes || 0;
          processedData.overtime += entry.overtime || 0;
          processedData.bonuses += entry.bonuses || 0;
          if (entry.department) {
            processedData.departmentBreakdown[entry.department] = 
              (processedData.departmentBreakdown[entry.department] || 0) + entry.amount;
          }
        });
        processedData.employeeCount = new Set(data.map(entry => entry.employeeId)).size;
        processedData.averageSalary = processedData.employeeCount ? 
          processedData.totalPayroll / processedData.employeeCount : 0;
        setPayrollData(processedData);
      } catch (error) {
        console.error('Error fetching payroll data:', error);
      }
    };
    fetchPayrollData();
  }, [tenant, timeRange]);
  const handleExport = () => {
    const csvContent = `
      Total Payroll,${payrollData.totalPayroll}
      Employee Count,${payrollData.employeeCount}
      Average Salary,${payrollData.averageSalary}
      Benefits,${payrollData.benefits}
      Taxes,${payrollData.taxes}
      Overtime,${payrollData.overtime}
      Bonuses,${payrollData.bonuses}
    `.trim();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'payroll_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Payroll & Financial Report</h3>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <PayrollSummaryMetrics data={payrollData} />
      <PayrollBreakdownTable data={payrollData} />
    </div>
  );
};
export default PayrollFinancialReport;