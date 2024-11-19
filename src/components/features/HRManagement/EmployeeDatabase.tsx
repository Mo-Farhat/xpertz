import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useToast } from "../../hooks/use-toast";
import { Employee } from './types';
import EmployeeForm from './EmployeeDatabase/EmployeeForm';
import EmployeeTable from './EmployeeDatabase/EmployeeTable';
import ExportEmployeesButton from './EmployeeDatabase/ExportEmployeeButton';

const EmployeeDatabase: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    hireDate: new Date(),
    salary: 0,
    status: 'active',
    employmentType: 'full-time'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'employees'), orderBy('lastName'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const employeesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        hireDate: doc.data().hireDate.toDate(),
      } as Employee));
      setEmployees(employeesData);
    });
    return unsubscribe;
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'employees'), {
        ...newEmployee,
        hireDate: new Date(newEmployee.hireDate),
      });
      setNewEmployee({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        hireDate: new Date(),
        salary: 0,
        status: 'active',
        employmentType: 'full-time'
      });
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEmployee = async (id: string, updatedEmployee: Partial<Employee>) => {
    try {
      await updateDoc(doc(db, 'employees', id), updatedEmployee);
      setEditingId(null);
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'employees', id));
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Employee Database</h3>
        <ExportEmployeesButton employees={employees} />
      </div>

      <EmployeeForm
        employee={newEmployee}
        onSubmit={handleAddEmployee}
        onChange={setNewEmployee}
      />

      <EmployeeTable
        employees={employees}
        editingId={editingId}
        onEdit={setEditingId}
        onUpdate={handleUpdateEmployee}
        onDelete={handleDeleteEmployee}
      />
    </div>
  );
};

export default EmployeeDatabase;