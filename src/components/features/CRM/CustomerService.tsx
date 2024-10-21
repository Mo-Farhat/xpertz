import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2, MessageSquare } from 'lucide-react';

interface Ticket {
  id: string;
  customerName: string;
  subject: string;
  description: string;
  status: 'open' | 'in progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  createdAt: Date;
}

const CustomerService: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicket, setNewTicket] = useState<Omit<Ticket, 'id' | 'createdAt'>>({
    customerName: '',
    subject: '',
    description: '',
    status: 'open',
    priority: 'medium',
    assignedTo: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ticketsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as Ticket));
      setTickets(ticketsData);
    });
    return unsubscribe;
  }, []);

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'tickets'), {
        ...newTicket,
        createdAt: new Date(),
      });
      setNewTicket({
        customerName: '',
        subject: '',
        description: '',
        status: 'open',
        priority: 'medium',
        assignedTo: '',
      });
    } catch (error) {
      console.error("Error adding ticket: ", error);
    }
  };

  const handleUpdateTicket = async (id: string, updatedTicket: Partial<Ticket>) => {
    try {
      await updateDoc(doc(db, 'tickets', id), updatedTicket);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating ticket: ", error);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tickets', id));
    } catch (error) {
      console.error("Error deleting ticket: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = tickets.map(ticket => 
      `${ticket.customerName},${ticket.subject},${ticket.description},${ticket.status},${ticket.priority},${ticket.assignedTo},${ticket.createdAt.toISOString()}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'customer_service_tickets.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
      <form onSubmit={handleAddTicket} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={newTicket.customerName}
            onChange={(e) => setNewTicket({ ...newTicket, customerName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Subject"
            value={newTicket.subject}
            onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
            className="p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={newTicket.description}
            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            className="p-2 border rounded col-span-2"
          />
          <select
            value={newTicket.status}
            onChange={(e) => setNewTicket({ ...newTicket, status: e.target.value as Ticket['status'] })}
            className="p-2 border rounded"
          >
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={newTicket.priority}
            onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as Ticket['priority'] })}
            className="p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="text"
            placeholder="Assigned To"
            value={newTicket.assignedTo}
            onChange={(e) => setNewTicket({ ...newTicket, assignedTo: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Ticket
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
            <th className="py-3 px-6 text-left">Customer</th>
            <th className="py-3 px-6 text-left">Subject</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Priority</th>
            <th className="py-3 px-6 text-left">Assigned To</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{ticket.customerName}</td>
              <td className="py-3 px-6 text-left">
                <div className="flex items-center">
                  <MessageSquare size={18} className="mr-2" />
                  {ticket.subject}
                </div>
              </td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  ticket.status === 'open' ? 'bg-yellow-200 text-yellow-800' :
                  ticket.status === 'in progress' ? 'bg-blue-200 text-blue-800' :
                  ticket.status === 'resolved' ? 'bg-green-200 text-green-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {ticket.status}
                </span>
              </td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  ticket.priority === 'high' ? 'bg-red-200 text-red-800' :
                  ticket.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {ticket.priority}
                </span>
              </td>
              <td className="py-3 px-6 text-left">{ticket.assignedTo}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(ticket.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteTicket(ticket.id)}
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

export default CustomerService;