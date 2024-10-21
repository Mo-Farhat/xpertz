import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { useToast } from "../hooks/use-toast"

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    loyaltyPoints: number;
    status: string;
  }
  
  const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({ name: '', email: '', phone: '', company: '', loyaltyPoints: 0, status: 'New' })
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
    const { toast } = useToast()
  
    useEffect(() => {
      const q = query(collection(db, 'customers'))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const customersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Customer))
        setCustomers(customersData)
      }, (error) => {
        console.error("Error fetching customers: ", error)
        toast("Failed to fetch customers. Please try again.")
      })
      return () => unsubscribe()
    }, [toast])
  
    const handleAddCustomer = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newCustomer.name || !newCustomer.email) {
        toast("Name and email are required.")
        return
      }
      try {
        await addDoc(collection(db, 'customers'), newCustomer)
        setNewCustomer({ name: '', email: '', phone: '', company: '', loyaltyPoints: 0, status: 'New' })
        toast("Customer added successfully.")
      } catch (error) {
        console.error("Error adding customer: ", error)
        toast("Failed to add customer. Please try again.")
      }
    }
  
    const handleEditCustomer = (customer: Customer) => {
      setEditingCustomer(customer)
      setNewCustomer({ name: customer.name, email: customer.email, phone: customer.phone, company: customer.company, loyaltyPoints: customer.loyaltyPoints, status: customer.status })
    }
  
    const handleUpdateCustomer = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!editingCustomer || !newCustomer.name || !newCustomer.email) {
        toast("Name and email are required.")
        return
      }
      try {
        const customerRef = doc(db, 'customers', editingCustomer.id)
        await updateDoc(customerRef, newCustomer)
        setEditingCustomer(null)
        setNewCustomer({ name: '', email: '', phone: '', company: '', loyaltyPoints: 0, status: 'New' })
        toast("Customer updated successfully.")
      } catch (error) {
        console.error("Error updating customer: ", error)
        toast("Failed to update customer. Please try again.")
      }
    }
  
    const handleDeleteCustomer = async (id: string) => {
      try {
        await deleteDoc(doc(db, 'customers', id))
        toast("Customer deleted successfully.")
      } catch (error) {
        console.error("Error deleting customer: ", error)
        toast("Failed to delete customer. Please try again.")
      }
    }
  
    
    return (
      <div className="custom-card w-full p-6">
        <h2 className="custom-card-title text-2xl font-bold mb-6">Customer Management</h2>
        <form onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer} className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Name"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              type="email"
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              type="text"
              placeholder="Company"
              value={newCustomer.company}
              onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between mt-4">
            <Button type="submit" className="custom-button">
              {editingCustomer ? (
                <>
                  <Edit className="mr-2 h-4 w-4" /> Update Customer
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Add Customer
                </>
              )}
            </Button>
            
          </div>
        </form>
        <div className="overflow-x-auto">
          <Table className="custom-table">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Email</TableHead>
                <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                <TableHead className="font-semibold text-gray-700">Company</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Loyalty Points</TableHead>
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.company}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      customer.status === 'New' ? 'bg-green-200 text-green-800' :
                      customer.status === 'Returning' ? 'bg-blue-200 text-blue-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {customer.status}
                    </span>
                  </TableCell>
                  <TableCell>{customer.loyaltyPoints}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEditCustomer(customer)} className="mr-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCustomer(customer.id)} className="text-red-600 hover:text-red-800 hover:bg-red-100">
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
  
  export default Customers