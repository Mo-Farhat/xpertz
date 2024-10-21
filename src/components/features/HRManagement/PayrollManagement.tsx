import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Save, Trash2 } from 'lucide-react';

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriod: string;
  basicSalary: number;
  overtime: number;
  deductions: number;
  netSalary: number;
  paymentDate: Date;
  status: 'pending' | 'paid';
}

const PayrollManagement: React.FC = () => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [newRecord, setNewRecord] = useState<Omit<PayrollRecord, 'id'>>({
    employeeId: '',
    employeeName: '',
    payPeriod: '',
    basicSalary: 0,
    overtime: 0,
    deductions: 0,
    netSalary: 0,
    paymentDate: new Date(),
    status: 'pending',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'payroll'), orderBy('paymentDate', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const records = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        paymentDate: doc.data().paymentDate.toDate(),
      } as PayrollRecord));
      setPayrollRecords(records);
    });
    return unsubscribe;
  }, []);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'payroll'), {
        ...newRecord,
        paymentDate: new Date(newRecord.paymentDate),
        netSalary: newRecord.basicSalary + newRecord.overtime - newRecord.deductions,
      });
      setNewRecord({
        employeeId: '',
        employeeName: '',
        payPeriod: '',
        basicSalary: 0,
        overtime: 0,
        deductions: 0,
        netSalary: 0,
        paymentDate: new Date(),
        status: 'pending',
      });
    } catch (error) {
      console.error("Error adding payroll record: ", error);
    }
  };

  const handleUpdateRecord = async (id: string, updatedRecord: Partial<PayrollRecord>) => {
    try {
      await updateDoc(doc(db, 'payroll', id), updatedRecord);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating payroll record: ", error);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'payroll', id));
    } catch (error) {
      console.error("Error deleting payroll record: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = payrollRecords.map(record => 
      `${record.employeeName},${record.payPeriod},${record.basicSalary},${record.overtime},${record.deductions},${record.netSalary},${record.paymentDate.toISOString()},${record.status}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'payroll_records.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Payroll Management</h3>
      <form onSubmit={handleAddRecord} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Employee ID"
            value={newRecord.employeeId}
            onChange={(e) => setNewRecord({ ...newRecord, employeeId: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Employee Name"
            value={newRecord.employeeName}
            onChange={(e) => setNewRecord({ ...newRecord, employeeName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Pay Period"
            value={newRecord.payPeriod}
            onChange={(e) => setNewRecord({ ...newRecord, payPeriod: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Basic Salary"
            value={newRecord.basicSalary}
            onChange={(e) => setNewRecord({ ...newRecord, basicSalary: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Overtime"
            value={newRecord.overtime}
            onChange={(e) => setNewRecord({ ...newRecord, overtime: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Deductions"
            value={newRecord.deductions}
            onChange={(e) => setNewRecord({ ...newRecord, deductions: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newRecord.paymentDate.toISOString().split('T')[0]}
            onChange={(e) => setNewRecord({ ...newRecord, paymentDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <select
            value={newRecord.status}
            onChange={(e) => setNewRecord({ ...newRecord, status: e.target.value as 'pending' | 'paid' })}
            className="p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Payroll Record
        </button>
      </form>
      <button
        onClick={handleExport}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
      >
        <Download size={18} className="mr-2" />
        Export CSV
      </button>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Employee</th>
            <th className="py-3 px-6 text-left">Pay Period</th>
            <th className="py-3 px-6 text-right">Basic Salary</th>
            <th className="py-3 px-6 text-right">Overtime</th>
            <th className="py-3 px-6 text-right">Deductions</th>
            <th className="py-3 px-6 text-right">Net Salary</th>
            <th className="py-3 px-6 text-left">Payment Date</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {payrollRecords.map((record) => (
            <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{record.employeeName}</td>
              <td className="py-3 px-6 text-left">{record.payPeriod}</td>
              <td className="py-3 px-6 text-right">${record.basicSalary.toFixed(2)}</td>
              <td className="py-3 px-6 text-right">${record.overtime.toFixed(2)}</td>
              <td className="py-3 px-6 text-right">${record.deductions.toFixed(2)}</td>
              <td className="py-3 px-6 text-right">${record.netSalary.toFixed(2)}</td>
              <td className="py-3 px-6 text-left">{record.paymentDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  record.status === 'paid' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                }`}>
                  {record.status}
                </span>
              </td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(record.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteRecord(record.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollManagement;