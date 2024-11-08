import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useToast } from "../hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({ 
    name: '', 
    email: '', 
    phone: '', 
    position: '' 
  });
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'employees'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const employeesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Employee));
      setEmployees(employeesData);
    }, (error) => {
      console.error("Error fetching employees: ", error);
      toast({
        title: "Error",
        description: "Failed to fetch employees. Please try again.",
        variant: "destructive"
      });
    });
    return () => unsubscribe();
  }, [toast]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required.",
        variant: "destructive"
      });
      return;
    }
    try {
      await addDoc(collection(db, 'employees'), newEmployee);
      setNewEmployee({ name: '', email: '', phone: '', position: '' });
      toast({
        title: "Success",
        description: "Employee added successfully.",
      });
    } catch (error) {
      console.error("Error adding employee: ", error);
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setNewEmployee({ 
      name: employee.name, 
      email: employee.email, 
      phone: employee.phone, 
      position: employee.position 
    });
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee || !newEmployee.name || !newEmployee.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required.",
        variant: "destructive"
      });
      return;
    }
    try {
      const employeeRef = doc(db, 'employees', editingEmployee.id);
      await updateDoc(employeeRef, newEmployee);
      setEditingEmployee(null);
      setNewEmployee({ name: '', email: '', phone: '', position: '' });
      toast({
        title: "Success",
        description: "Employee updated successfully.",
      });
    } catch (error) {
      console.error("Error updating employee: ", error);
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'employees', id));
      toast({
        title: "Success",
        description: "Employee deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting employee: ", error);
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full p-6 space-y-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
      <form onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Name"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          />
          <Input
            type="tel"
            placeholder="Phone"
            value={newEmployee.phone}
            onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Position"
            value={newEmployee.position}
            onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto">
          {editingEmployee ? (
            <>
              <Edit className="mr-2 h-4 w-4" /> Update Employee
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Employee
            </>
          )}
        </Button>
      </form>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditEmployee(employee)}
                    className="mr-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Employees;