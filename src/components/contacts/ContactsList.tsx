import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useToast } from "../hooks/use-toast"

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const ContactsList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({ name: '', email: '', phone: '' })
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const q = query(collection(db, 'contacts'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const contactsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        phone: doc.data().phone
      } as Contact))
      setContacts(contactsData)
    }, (error) => {
      console.error("Error fetching contacts: ", error)
      toast("Failed to fetch contacts. Please try again.")
    })
    return () => unsubscribe()
  }, [toast])

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContact.name || !newContact.email) {
      toast("Name and email are required.")
      return
    }
    try {
      await addDoc(collection(db, 'contacts'), newContact)
      setNewContact({ name: '', email: '', phone: '' })
      toast("Contact added successfully.")
    } catch (error) {
      console.error("Error adding contact: ", error)
      toast("Failed to add contact. Please try again.")
    }
  }

  const handleEditContact = async (contact: Contact) => {
    setEditingContact(contact)
    setNewContact({ name: contact.name, email: contact.email, phone: contact.phone })
  }

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingContact || !newContact.name || !newContact.email) {
      toast("Name and email are required.")
      return
    }
    try {
      const contactRef = doc(db, 'contacts', editingContact.id)
      await updateDoc(contactRef, newContact)
      setEditingContact(null)
      setNewContact({ name: '', email: '', phone: '' })
      toast("Contact updated successfully.")
    } catch (error) {
      console.error("Error updating contact: ", error)
      toast("Failed to update contact. Please try again.")
    }
  }

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contacts', id))
      toast("Contact deleted successfully.")
    } catch (error) {
      console.error("Error deleting contact: ", error)
      toast("Failed to delete contact. Please try again.")
    }
  }

  return (
    <div className="custom-card w-full p-6">
      <h2 className="custom-card-title text-2xl font-bold mb-6">Contact Management</h2>
      <form onSubmit={editingContact ? handleUpdateContact : handleAddContact} className="mb-6">
        <div className="grid grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <Input
            type="email"
            placeholder="Email"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <Input
            type="tel"
            placeholder="Phone"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button type="submit" className="custom-button mt-4">
          {editingContact ? (
            <>
              <Edit className="mr-2 h-4 w-4" /> Update Contact
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Contact
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
              <TableHead className="font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} className="hover:bg-gray-50 transition-colors duration-200">
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleEditContact(contact)} className="mr-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteContact(contact.id)} className="text-red-600 hover:text-red-800 hover:bg-red-100">
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

export default ContactsList