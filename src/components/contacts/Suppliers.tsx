import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useToast } from "../hooks/use-toast"


interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
    product: string;
  }
  
  const Suppliers: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [newSupplier, setNewSupplier] = useState<Omit<Supplier, 'id'>>({ name: '', email: '', phone: '', product: '' })
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
    const { toast } = useToast()
  
    useEffect(() => {
      const q = query(collection(db, 'suppliers'))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const suppliersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Supplier))
        setSuppliers(suppliersData)
      }, (error) => {
        console.error("Error fetching suppliers: ", error)
        toast("Failed to fetch suppliers. Please try again.")
      })
      return () => unsubscribe()
    }, [toast])
  
    const handleAddSupplier = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newSupplier.name || !newSupplier.email) {
        toast("Name and email are required.")
        return
      }
      try {
        await addDoc(collection(db, 'suppliers'), newSupplier)
        setNewSupplier({ name: '', email: '', phone: '', product: '' })
        toast("Supplier added successfully.")
      } catch (error) {
        console.error("Error adding supplier: ", error)
        toast("Failed to add supplier. Please try again.")
      }
    }
  
    const handleEditSupplier = (supplier: Supplier) => {
      setEditingSupplier(supplier)
      setNewSupplier({ name: supplier.name, email: supplier.email, phone: supplier.phone, product: supplier.product })
    }
  
    const handleUpdateSupplier = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!editingSupplier || !newSupplier.name || !newSupplier.email) {
        toast("Name and email are required.")
        return
      }
      try {
        const supplierRef = doc(db, 'suppliers', editingSupplier.id)
        await updateDoc(supplierRef, newSupplier)
        setEditingSupplier(null)
        setNewSupplier({ name: '', email: '', phone: '', product: '' })
        toast("Supplier updated successfully.")
      } catch (error) {
        console.error("Error updating supplier: ", error)
        toast("Failed to update supplier. Please try again.")
      }
    }
  
    const handleDeleteSupplier = async (id: string) => {
      try {
        await deleteDoc(doc(db, 'suppliers', id))
        toast("Supplier deleted successfully.")
      } catch (error) {
        console.error("Error deleting supplier: ", error)
        toast("Failed to delete supplier. Please try again.")
      }
    }
  
    return (
      <div className="custom-card w-full p-6">
        <h2 className="custom-card-title text-2xl font-bold mb-6">Supplier Management</h2>
        <form onSubmit={editingSupplier ? handleUpdateSupplier : handleAddSupplier} className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Name"
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              type="email"
              placeholder="Email"
              value={newSupplier.email}
              onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={newSupplier.phone}
              onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              type="text"
              placeholder="Product"
              value={newSupplier.product}
              onChange={(e) => setNewSupplier({ ...newSupplier, product: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button type="submit" className="custom-button mt-4">
            {editingSupplier ? (
              <>
                <Edit className="mr-2 h-4 w-4" /> Update Supplier
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Add Supplier
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
                <TableHead className="font-semibold text-gray-700">Product</TableHead>
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.product}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEditSupplier(supplier)} className="mr-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteSupplier(supplier.id)} className="text-red-600 hover:text-red-800 hover:bg-red-100">
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
  
  export default Suppliers