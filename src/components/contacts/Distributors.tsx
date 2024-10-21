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
        toast("Failed to fetch distributors. Please try again.")
      })
      return () => unsubscribe()
    }, [toast])
  
    const handleAddDistributor = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newDistributor.name || !newDistributor.email) {
        toast("Name and email are required.")
        return
      }
      try {
        await addDoc(collection(db, 'distributors'), newDistributor)
        setNewDistributor({ name: '', email: '', phone: '', region: '' })
        toast("Distributor added successfully.")
      } catch (error) {
        console.error("Error adding distributor: ", error)
        toast("Failed to add distributor. Please try again.")
      }
    }
  
    const handleEditDistributor = (distributor: Distributor) => {
      setEditingDistributor(distributor)
      setNewDistributor({ name: distributor.name, email: distributor.email, phone: distributor.phone, region: distributor.region })
    }
  
    const handleUpdateDistributor = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!editingDistributor || !newDistributor.name || !newDistributor.email) {
        toast("Name and email are required.")
        return
      }
      try {
        const distributorRef = doc(db, 'distributors', editingDistributor.id)
        await updateDoc(distributorRef, newDistributor)
        setEditingDistributor(null)
        setNewDistributor({ name: '', email: '', phone: '', region: '' })
        toast("Distributor updated successfully.")
      } catch (error) {
        console.error("Error updating distributor: ", error)
        toast("Failed to update distributor. Please try again.")
      }
    }
  
    const handleDeleteDistributor = async (id: string) => {
      try {
        await deleteDoc(doc(db, 'distributors', id))
        toast("Distributor deleted successfully.")
      } catch (error) {
        console.error("Error deleting distributor: ", error)
        toast("Failed to delete distributor. Please try again.")
      }
    }
  
    return (
      <div className="custom-card w-full p-6">
        <h2 className="custom-card-title text-2xl font-bold mb-6">Distributor Management</h2>
        <form onSubmit={editingDistributor ? handleUpdateDistributor : handleAddDistributor} className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Name"
              value={newDistributor.name}
              onChange={(e) => setNewDistributor({ ...newDistributor, name: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              type="email"
              placeholder="Email"
              value={newDistributor.email}
              onChange={(e) => setNewDistributor({ ...newDistributor, email: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={newDistributor.phone}
              onChange={(e) => setNewDistributor({ ...newDistributor, phone: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Input
              type="text"
              placeholder="Region"
              value={newDistributor.region}
              onChange={(e) => setNewDistributor({ ...newDistributor, region: e.target.value })}
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button type="submit" className="custom-button mt-4">
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
          <Table className="custom-table">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Email</TableHead>
                <TableHead className="font-semibold text-gray-700">Phone</TableHead>
                <TableHead className="font-semibold text-gray-700">Region</TableHead>
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributors.map((distributor) => (
                <TableRow key={distributor.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <TableCell>{distributor.name}</TableCell>
                  <TableCell>{distributor.email}</TableCell>
                  <TableCell>{distributor.phone}</TableCell>
                  <TableCell>{distributor.region}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEditDistributor(distributor)} className="mr-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteDistributor(distributor.id)} className="text-red-600 hover:text-red-800 hover:bg-red-100">
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