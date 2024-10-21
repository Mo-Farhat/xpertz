import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useToast } from "../hooks/use-toast"

interface Employee {
    id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
  }
  
  const Employees: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({ name: '', email: '', phone: '', position: '' })
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
    const { toast } = useToast()
  
    useEffect(() => {
      const q = query(collection(db, 'employees'))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const employeesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Employee))
        setEmployees(employeesData)
      }, (error) => {
        console.error("Error fetching employees: ", error)
        toast("Failed to fetch employees. Please try again.")
      })
      return () => unsubscribe()
    }, [toast])
  
    const handleAddEmployee = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newEmployee.name || !newEmployee.email) {
        toast("Name and email are required.")
        return
      }
      try {
        await addDoc(collection(db, 'employees'), newEmployee)
        setNewEmployee({ name: '', email: '', phone: '', position: '' })
        toast("Employee added successfully.")
      } catch (error) {
        console.error("Error adding employee: ", error)
        toast("Failed to add employee. Please try again.")
      }
    }
  
    const handleEditEmployee = (employee: Employee) => {
      setEditingEmployee(employee)
      setNewEmployee({ name: employee.name, email: employee.email, phone: employee.phone, position: employee.position })
    }
  
    const handleUpdateEmployee = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!editingEmployee || !newEmployee.name || !newEmployee.email) {
        toast("Name and email are required.")
        return
      }
      try {
        const employeeRef = doc(db, 'employees', editingEmployee.id)
        await updateDoc(employeeRef, newEmployee)
        setEditingEmployee(null)
        setNewEmployee({ name: '', email: '', phone: '', position: '' })
        toast("Employee updated successfully.")
      } catch (error) {
        console.error("Error updating employee: ", error)
        toast("Failed to update employee. Please try again.")
      }
    }
  
    const handleDeleteEmployee = async (id: string) => {
      try {
        await deleteDoc(doc(db, 'employees', id))
        toast("Employee deleted successfully.")
      } catch (error) {
        console.error("Error deleting employee: ", error)
        toast("Failed to delete employee. Please try again.")
      }
    }
  
    return (
      <div className="custom-card w-full p-6">
        <h2 className="custom-card-title text-2xl font-bold mb-6">Employee Management</h2>
        <form onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee} className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              type="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              type="text"
              placeholder="Position"
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button type="submit" className="custom-button mt-4">
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
          <Table className="custom-table">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Email</TableHead>
                <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                <TableHead className="font-semibold text-gray-700">Position</TableHead>
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEditEmployee(employee)} className="mr-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteEmployee(employee.id)} className="text-red-600 hover:text-red-800 hover:bg-red-100">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
  
  export default Employees