import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { useToast } from "../hooks/use-toast"

interface Distributor {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
}

const Distributors: React.FC = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([])
  const [newDistributor, setNewDistributor] = useState<Omit<Distributor, 'id'>>({ name: '', email: '', phone: '', region: '' })
  const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const q = query(collection(db, 'distributors'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const distributorsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Distributor))
      setDistributors(distributorsData)
    }, (error) => {
      console.error("Error fetching distributors: ", error)
      toast({
        title: "Error",
        description: "Failed to fetch distributors. Please try again.",
        variant: "destructive",
      })
    })
    return () => unsubscribe()
  }, [toast])

  const handleAddDistributor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDistributor.name || !newDistributor.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required.",
        variant: "destructive",
      })
      return
    }
    try {
      await addDoc(collection(db, 'distributors'), newDistributor)
      setNewDistributor({ name: '', email: '', phone: '', region: '' })
      toast({
        title: "Success",
        description: "Distributor added successfully.",
      })
    } catch (error) {
      console.error("Error adding distributor: ", error)
      toast({
        title: "Error",
        description: "Failed to add distributor. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditDistributor = (distributor: Distributor) => {
    setEditingDistributor(distributor)
    setNewDistributor({ 
      name: distributor.name, 
      email: distributor.email, 
      phone: distributor.phone, 
      region: distributor.region 
    })
  }

  const handleUpdateDistributor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDistributor || !newDistributor.name || !newDistributor.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required.",
        variant: "destructive",
      })
      return
    }
    try {
      const distributorRef = doc(db, 'distributors', editingDistributor.id)
      await updateDoc(distributorRef, newDistributor)
      setEditingDistributor(null)
      setNewDistributor({ name: '', email: '', phone: '', region: '' })
      toast({
        title: "Success",
        description: "Distributor updated successfully.",
      })
    } catch (error) {
      console.error("Error updating distributor: ", error)
      toast({
        title: "Error",
        description: "Failed to update distributor. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDistributor = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'distributors', id))
      toast({
        title: "Success",
        description: "Distributor deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting distributor: ", error)
      toast({
        title: "Error",
        description: "Failed to delete distributor. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-full p-6 space-y-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">Distributor Management</h2>
      <form onSubmit={editingDistributor ? handleUpdateDistributor : handleAddDistributor} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Name"
            value={newDistributor.name}
            onChange={(e) => setNewDistributor({ ...newDistributor, name: e.target.value })}
            className="w-full"
          />
          <Input
            type="email"
            placeholder="Email"
            value={newDistributor.email}
            onChange={(e) => setNewDistributor({ ...newDistributor, email: e.target.value })}
            className="w-full"
          />
          <Input
            type="tel"
            placeholder="Phone"
            value={newDistributor.phone}
            onChange={(e) => setNewDistributor({ ...newDistributor, phone: e.target.value })}
            className="w-full"
          />
          <Input
            type="text"
            placeholder="Region"
            value={newDistributor.region}
            onChange={(e) => setNewDistributor({ ...newDistributor, region: e.target.value })}
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full md:w-auto">
          {editingDistributor ? (
            <>
              <Edit className="mr-2 h-4 w-4" /> Update Distributor
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Distributor
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
              <TableHead>Region</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {distributors.map((distributor) => (
              <TableRow key={distributor.id}>
                <TableCell>{distributor.name}</TableCell>
                <TableCell>{distributor.email}</TableCell>
                <TableCell>{distributor.phone}</TableCell>
                <TableCell>{distributor.region}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditDistributor(distributor)}
                    className="mr-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDistributor(distributor.id)}
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

export default Distributors