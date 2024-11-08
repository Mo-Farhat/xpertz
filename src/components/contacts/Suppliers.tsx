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
      toast({
        title: "Error",
        description: "Failed to fetch suppliers. Please try again.",
        variant: "destructive",
      })
    })
    return () => unsubscribe()
  }, [toast])

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSupplier.name || !newSupplier.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required.",
        variant: "destructive",
      })
      return
    }
    try {
      await addDoc(collection(db, 'suppliers'), newSupplier)
      setNewSupplier({ name: '', email: '', phone: '', product: '' })
      toast({
        title: "Success",
        description: "Supplier added successfully.",
      })
    } catch (error) {
      console.error("Error adding supplier: ", error)
      toast({
        title: "Error",
        description: "Failed to add supplier. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setNewSupplier({ name: supplier.name, email: supplier.email, phone: supplier.phone, product: supplier.product })
  }

  const handleUpdateSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSupplier || !newSupplier.name || !newSupplier.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required.",
        variant: "destructive",
      })
      return
    }
    try {
      const supplierRef = doc(db, 'suppliers', editingSupplier.id)
      await updateDoc(supplierRef, newSupplier)
      setEditingSupplier(null)
      setNewSupplier({ name: '', email: '', phone: '', product: '' })
      toast({
        title: "Success",
        description: "Supplier updated successfully.",
      })
    } catch (error) {
      console.error("Error updating supplier: ", error)
      toast({
        title: "Error",
        description: "Failed to update supplier. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSupplier = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'suppliers', id))
      toast({
        title: "Success",
        description: "Supplier deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting supplier: ", error)
      toast({
        title: "Error",
        description: "Failed to delete supplier. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Supplier Management</h2>
      </div>
      
      <form onSubmit={editingSupplier ? handleUpdateSupplier : handleAddSupplier} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Name"
            value={newSupplier.name}
            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
            className="w-full"
          />
          <Input
            type="email"
            placeholder="Email"
            value={newSupplier.email}
            onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
            className="w-full"
          />
          <Input
            type="tel"
            placeholder="Phone"
            value={newSupplier.phone}
            onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
            className="w-full"
          />
          <Input
            type="text"
            placeholder="Product"
            value={newSupplier.product}
            onChange={(e) => setNewSupplier({ ...newSupplier, product: e.target.value })}
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full md:w-auto">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{supplier.product}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSupplier(supplier)}
                    className="mr-2 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    className="hover:text-red-600"
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
  )
}

export default Suppliers