import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useToast } from "../hooks/use-toast"

interface WholesaleBuyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

const WholesaleBuyers: React.FC = () => {
  const [wholesaleBuyers, setWholesaleBuyers] = useState<WholesaleBuyer[]>([])
  const [newBuyer, setNewBuyer] = useState<Omit<WholesaleBuyer, 'id'>>({ 
    name: '', 
    email: '', 
    phone: '', 
    company: '' 
  })
  const [editingBuyer, setEditingBuyer] = useState<WholesaleBuyer | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const q = query(collection(db, 'wholesaleBuyers'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const buyersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as WholesaleBuyer))
      setWholesaleBuyers(buyersData)
    }, (error) => {
      console.error("Error fetching wholesale buyers: ", error)
      toast({
        title: "Error",
        description: "Failed to fetch wholesale buyers. Please try again.",
        variant: "destructive",
      })
    })
    return () => unsubscribe()
  }, [toast])

  const handleAddBuyer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBuyer.name || !newBuyer.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required.",
        variant: "destructive",
      })
      return
    }
    try {
      await addDoc(collection(db, 'wholesaleBuyers'), newBuyer)
      setNewBuyer({ name: '', email: '', phone: '', company: '' })
      toast({
        title: "Success",
        description: "Wholesale buyer added successfully.",
      })
    } catch (error) {
      console.error("Error adding wholesale buyer: ", error)
      toast({
        title: "Error",
        description: "Failed to add wholesale buyer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditBuyer = (buyer: WholesaleBuyer) => {
    setEditingBuyer(buyer)
    setNewBuyer({ 
      name: buyer.name, 
      email: buyer.email, 
      phone: buyer.phone, 
      company: buyer.company 
    })
  }

  const handleUpdateBuyer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBuyer || !newBuyer.name || !newBuyer.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required.",
        variant: "destructive",
      })
      return
    }
    try {
      const buyerRef = doc(db, 'wholesaleBuyers', editingBuyer.id)
      await updateDoc(buyerRef, newBuyer)
      setEditingBuyer(null)
      setNewBuyer({ name: '', email: '', phone: '', company: '' })
      toast({
        title: "Success",
        description: "Wholesale buyer updated successfully.",
      })
    } catch (error) {
      console.error("Error updating wholesale buyer: ", error)
      toast({
        title: "Error",
        description: "Failed to update wholesale buyer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBuyer = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'wholesaleBuyers', id))
      toast({
        title: "Success",
        description: "Wholesale buyer deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting wholesale buyer: ", error)
      toast({
        title: "Error",
        description: "Failed to delete wholesale buyer. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-full p-6 space-y-6">
      <h2 className="text-2xl font-bold">Wholesale Buyer Management</h2>
      <form onSubmit={editingBuyer ? handleUpdateBuyer : handleAddBuyer} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Name"
            value={newBuyer.name}
            onChange={(e) => setNewBuyer({ ...newBuyer, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={newBuyer.email}
            onChange={(e) => setNewBuyer({ ...newBuyer, email: e.target.value })}
          />
          <Input
            type="tel"
            placeholder="Phone"
            value={newBuyer.phone}
            onChange={(e) => setNewBuyer({ ...newBuyer, phone: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Company"
            value={newBuyer.company}
            onChange={(e) => setNewBuyer({ ...newBuyer, company: e.target.value })}
          />
        </div>
        <Button type="submit" className="w-full md:w-auto">
          {editingBuyer ? (
            <>
              <Edit className="mr-2 h-4 w-4" /> Update Wholesale Buyer
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Wholesale Buyer
            </>
          )}
        </Button>
      </form>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wholesaleBuyers.map((buyer) => (
              <TableRow key={buyer.id}>
                <TableCell>{buyer.name}</TableCell>
                <TableCell>{buyer.email}</TableCell>
                <TableCell>{buyer.phone}</TableCell>
                <TableCell>{buyer.company}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditBuyer(buyer)}
                    className="mr-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBuyer(buyer.id)}
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
  )
}

export default WholesaleBuyers