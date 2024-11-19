import React from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Employee } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Loader2 } from 'lucide-react';
import { calculatePayrollComponents } from './PayrollCalculator';

interface PayrollFormProps {
    employees: Employee[];
    onSubmit: (employeeId: string, overtime: number, bonuses: number, deductions: number) => Promise<void>;
    isLoading: boolean;
  }
  
  const PayrollForm: React.FC<PayrollFormProps> = ({ employees, onSubmit, isLoading }) => {
    const [selectedEmployee, setSelectedEmployee] = React.useState('');
    const [overtime, setOvertime] = React.useState(0);
    const [bonuses, setBonuses] = React.useState(0);
    const [deductions, setDeductions] = React.useState(0);
    const [preview, setPreview] = React.useState<ReturnType<typeof calculatePayrollComponents> | null>(null);
  
    const handleEmployeeSelect = (employeeId: string) => {
      setSelectedEmployee(employeeId);
      const employee = employees.find(e => e.id === employeeId);
      if (employee) {
        const components = calculatePayrollComponents(employee, overtime, bonuses);
        setPreview(components);
      }
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedEmployee) return;
      await onSubmit(selectedEmployee, overtime, bonuses, deductions);
      setSelectedEmployee('');
      setOvertime(0);
      setBonuses(0);
      setDeductions(0);
      setPreview(null);
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generate New Payroll Record</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employee">Select Employee</Label>
                <Select 
                  value={selectedEmployee} 
                  onValueChange={handleEmployeeSelect}
                  disabled={isLoading}
                >
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Choose an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName} - {employee.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="overtime">Overtime Hours</Label>
                <Input
                  id="overtime"
                  type="number"
                  placeholder="Enter overtime hours"
                  value={overtime}
                  onChange={(e) => {
                    setOvertime(Number(e.target.value));
                    if (selectedEmployee) {
                      const employee = employees.find(e => e.id === selectedEmployee);
                      if (employee) {
                        setPreview(calculatePayrollComponents(employee, Number(e.target.value), bonuses));
                      }
                    }
                  }}
                  min={0}
                  disabled={isLoading}
                />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="bonuses">Bonuses Amount</Label>
                <Input
                  id="bonuses"
                  type="number"
                  placeholder="Enter bonus amount"
                  value={bonuses}
                  onChange={(e) => {
                    setBonuses(Number(e.target.value));
                    if (selectedEmployee) {
                      const employee = employees.find(e => e.id === selectedEmployee);
                      if (employee) {
                        setPreview(calculatePayrollComponents(employee, overtime, Number(e.target.value)));
                      }
                    }
                  }}
                  min={0}
                  disabled={isLoading}
                />
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="deductions">Additional Deductions</Label>
                <Input
                  id="deductions"
                  type="number"
                  placeholder="Enter deductions amount"
                  value={deductions}
                  onChange={(e) => setDeductions(Number(e.target.value))}
                  min={0}
                  disabled={isLoading}
                />
              </div>
            </div>
  
            {preview && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Payroll Preview</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Basic Salary: ${preview.basicSalary.toFixed(2)}</div>
                  <div>Overtime Pay: ${preview.overtimePay.toFixed(2)}</div>
                  <div>Benefits: ${preview.benefits.toFixed(2)}</div>
                  <div>Tax Deductions: ${preview.taxes.toFixed(2)}</div>
                  <div>Social Security: ${preview.socialSecurity.toFixed(2)}</div>
                  <div>Health Insurance: ${preview.healthInsurance.toFixed(2)}</div>
                  <div className="col-span-2 pt-2 font-semibold">
                    Estimated Net Salary: ${(preview.netSalary - deductions).toFixed(2)}
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={!selectedEmployee || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Payroll Record'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };
  
  export default PayrollForm;