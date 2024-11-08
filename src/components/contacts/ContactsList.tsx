import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useToast } from "../hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const ContactsList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({ name: '', email: '', phone: '' });
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'contacts'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const contactsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || '',
        email: doc.data().email || '',
        phone: doc.data().phone || ''
      } as Contact));
      setContacts(contactsData);
    }, (error) => {
      console.error("Error fetching contacts: ", error);
      toast({
        title: "Error",
        description: "Failed to fetch contacts. Please try again.",
        variant: "destructive"
      });
    });
    return () => unsubscribe();
  }, [toast]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.email) {
      toast({
        title: "Error",
        description: "Name and email are required.",
        variant: "destructive"
      });
      return;
    }
    try {
      await addDoc(collection(db, 'contacts'), newContact);
      setNewContact({ name: '', email: '', phone: '' });
      toast({
        title: "Success",
        description: "Contact added successfully."
      });
    } catch (error) {
      console.error("Error adding contact: ", error);
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setNewContact({ name: contact.name, email: contact.email, phone: contact.phone });
  };

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact || !newContact.name || !newContact.email) {
      toast({
        title: "Error",
        description: "Name and email are required.",
        variant: "destructive"
      });
      return;
    }
    try {
      const contactRef = doc(db, 'contacts', editingContact.id);
      await updateDoc(contactRef, newContact);
      setEditingContact(null);
      setNewContact({ name: '', email: '', phone: '' });
      toast({
        title: "Success",
        description: "Contact updated successfully."
      });
    } catch (error) {
      console.error("Error updating contact: ", error);
      toast({
        title: "Error",
        description: "Failed to update contact. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contacts', id));
      toast({
        title: "Success",
        description: "Contact deleted successfully."
      });
    } catch (error) {
      console.error("Error deleting contact: ", error);
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full p-6 space-y-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Contact Management</h2>
      <form onSubmit={editingContact ? handleUpdateContact : handleAddContact} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
          />
          <Input
            type="tel"
            placeholder="Phone"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
          />
        </div>
        <Button type="submit">
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleEditContact(contact)} className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteContact(contact.id)} className="text-red-600">
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

export default ContactsList;