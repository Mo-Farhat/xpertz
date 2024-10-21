import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Save, Trash2 } from 'lucide-react';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: Date;
  salary: number;
}

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
  });
  const [editingId, setEditingId] = useState<string | null>(null);

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
      });
    } catch (error) {
      console.error("Error adding employee: ", error);
    }
  };

  const handleUpdateEmployee = async (id: string, updatedEmployee: Partial<Employee>) => {
    try {
      await updateDoc(doc(db, 'employees', id), updatedEmployee);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating employee: ", error);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'employees', id));
    } catch (error) {
      console.error("Error deleting employee: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = employees.map(employee => 
      `${employee.firstName},${employee.lastName},${employee.email},${employee.phone},${employee.position},${employee.department},${employee.hireDate.toISOString()},${employee.salary}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'employees.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Employee Database</h3>
      <form onSubmit={handleAddEmployee} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={newEmployee.firstName}
            onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newEmployee.lastName}
            onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={newEmployee.phone}
            onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Position"
            value={newEmployee.position}
            onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Department"
            value={newEmployee.department}
            onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newEmployee.hireDate.toISOString().split('T')[0]}
            onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Salary"
            value={newEmployee.salary}
            onChange={(e) => setNewEmployee({ ...newEmployee, salary: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Employee
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
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Phone</th>
            <th className="py-3 px-6 text-left">Position</th>
            <th className="py-3 px-6 text-left">Department</th>
            <th className="py-3 px-6 text-left">Hire Date</th>
            <th className="py-3 px-6 text-right">Salary</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {employee.firstName} {employee.lastName}
              </td>
              <td className="py-3 px-6 text-left">{employee.email}</td>
              <td className="py-3 px-6 text-left">{employee.phone}</td>
              <td className="py-3 px-6 text-left">{employee.position}</td>
              <td className="py-3 px-6 text-left">{employee.department}</td>
              <td className="py-3 px-6 text-left">{employee.hireDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-right">${employee.salary.toFixed(2)}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(employee.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
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

export default EmployeeDatabase;