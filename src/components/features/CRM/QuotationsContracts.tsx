import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2, FileText, DollarSign } from 'lucide-react';

interface QuotationContract {
  id: string;
  type: 'quotation' | 'contract';
  customerName: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil: Date;
  content: string;
  createdAt: Date;
}

const QuotationsContracts: React.FC = () => {
  const [documents, setDocuments] = useState<QuotationContract[]>([]);
  const [newDocument, setNewDocument] = useState<Omit<QuotationContract, 'id' | 'createdAt'>>({
    type: 'quotation',
    customerName: '',
    amount: 0,
    status: 'draft',
    validUntil: new Date(),
    content: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'quotationsContracts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        validUntil: doc.data().validUntil.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      } as QuotationContract));
      setDocuments(documentsData);
    });
    return unsubscribe;
  }, []);

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'quotationsContracts'), {
        ...newDocument,
        createdAt: new Date(),
      });
      setNewDocument({
        type: 'quotation',
        customerName: '',
        amount: 0,
        status: 'draft',
        validUntil: new Date(),
        content: '',
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleUpdateDocument = async (id: string, updatedDocument: Partial<QuotationContract>) => {
    try {
      await updateDoc(doc(db, 'quotationsContracts', id), updatedDocument);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'quotationsContracts', id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = documents.map(doc => 
      `${doc.type},${doc.customerName},${doc.amount},${doc.status},${doc.validUntil.toISOString()},${doc.content},${doc.createdAt.toISOString()}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'quotations_contracts.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Quotations & Contracts</h3>
      <form onSubmit={handleAddDocument} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <select
            value={newDocument.type}
            onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value as 'quotation' | 'contract' })}
            className="p-2 border rounded"
          >
            <option value="quotation">Quotation</option>
            <option value="contract">Contract</option>
          </select>
          <input
            type="text"
            placeholder="Customer Name"
            value={newDocument.customerName}
            onChange={(e) => setNewDocument({ ...newDocument, customerName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newDocument.amount}
            onChange={(e) => setNewDocument({ ...newDocument, amount: parseFloat(e.target.value) })}
            className="p-2 border rounded"
          />
          <select
            value={newDocument.status}
            onChange={(e) => setNewDocument({ ...newDocument, status: e.target.value as QuotationContract['status'] })}
            className="p-2 border rounded"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            type="date"
            value={newDocument.validUntil.toISOString().split('T')[0]}
            onChange={(e) => setNewDocument({ ...newDocument, validUntil: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <textarea
            placeholder="Document Content"
            value={newDocument.content}
            onChange={(e) => setNewDocument({ ...newDocument, content: e.target.value })}
            className="p-2 border rounded col-span-2"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Document
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
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Customer</th>
            <th className="py-3 px-6 text-right">Amount</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Valid Until</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex items-center">
                  <FileText size={18} className="mr-2" />
                  {doc.type}
                </div>
              </td>
              <td className="py-3 px-6 text-left">{doc.customerName}</td>
              <td className="py-3 px-6 text-right">
                <div className="flex items-center justify-end">
                  <DollarSign size={18} className="mr-2" />
                  {doc.amount.toFixed(2)}
                </div>
              </td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  doc.status === 'draft' ? 'bg-gray-200 text-gray-800' :
                  doc.status === 'sent' ? 'bg-yellow-200 text-yellow-800' :
                  doc.status === 'accepted' ? 'bg-green-200 text-green-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {doc.status}
                </span>
              </td>
              <td className="py-3 px-6 text-left">{doc.validUntil.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(doc.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
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

export default QuotationsContracts;