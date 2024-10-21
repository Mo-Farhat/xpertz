import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2, Mail, Users } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social media';
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  targetAudience: string;
  content: string;
  scheduledDate: Date;
  createdAt: Date;
}

const MarketingAutomation: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newCampaign, setNewCampaign] = useState<Omit<Campaign, 'id' | 'createdAt'>>({
    name: '',
    type: 'email',
    status: 'draft',
    targetAudience: '',
    content: '',
    scheduledDate: new Date(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const campaignsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        scheduledDate: doc.data().scheduledDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      } as Campaign));
      setCampaigns(campaignsData);
    });
    return unsubscribe;
  }, []);

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'campaigns'), {
        ...newCampaign,
        createdAt: new Date(),
      });
      setNewCampaign({
        name: '',
        type: 'email',
        status: 'draft',
        targetAudience: '',
        content: '',
        scheduledDate: new Date(),
      });
    } catch (error) {
      console.error("Error adding campaign: ", error);
    }
  };

  const handleUpdateCampaign = async (id: string, updatedCampaign: Partial<Campaign>) => {
    try {
      await updateDoc(doc(db, 'campaigns', id), updatedCampaign);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating campaign: ", error);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'campaigns', id));
    } catch (error) {
      console.error("Error deleting campaign: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = campaigns.map(campaign => 
      `${campaign.name},${campaign.type},${campaign.status},${campaign.targetAudience},${campaign.content},${campaign.scheduledDate.toISOString()},${campaign.createdAt.toISOString()}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'marketing_campaigns.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Marketing Automation</h3>
      <form onSubmit={handleAddCampaign} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Campaign Name"
            value={newCampaign.name}
            onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={newCampaign.type}
            onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value as Campaign['type'] })}
            className="p-2 border rounded"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="social media">Social Media</option>
          </select>
          <select
            value={newCampaign.status}
            onChange={(e) => setNewCampaign({ ...newCampaign, status: e.target.value as Campaign['status'] })}
            className="p-2 border rounded"
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="text"
            placeholder="Target Audience"
            value={newCampaign.targetAudience}
            onChange={(e) => setNewCampaign({ ...newCampaign, targetAudience: e.target.value })}
            className="p-2 border rounded"
          />
          <textarea
            placeholder="Campaign Content"
            value={newCampaign.content}
            onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
            className="p-2 border rounded col-span-2"
          />
          <input
            type="datetime-local"
            value={newCampaign.scheduledDate.toISOString().slice(0, 16)}
            onChange={(e) => setNewCampaign({ ...newCampaign, scheduledDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Campaign
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
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Target Audience</th>
            <th className="py-3 px-6 text-left">Scheduled Date</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {campaigns.map((campaign) => (
            <tr key={campaign.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{campaign.name}</td>
              <td className="py-3 px-6 text-left">
                <div className="flex items-center">
                  {campaign.type === 'email' ? <Mail size={18} className="mr-2" /> :
                   campaign.type === 'sms' ? <MessageSquare size={18} className="mr-2" /> :
                   <Users size={18} className="mr-2" />}
                  {campaign.type}
                </div>
              </td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  campaign.status === 'draft' ? 'bg-gray-200 text-gray-800' :
                  campaign.status === 'scheduled' ? 'bg-yellow-200 text-yellow-800' :
                  campaign.status === 'active' ? 'bg-green-200 text-green-800' :
                  'bg-blue-200 text-blue-800'
                }`}>
                  {campaign.status}
                </span>
              </td>
              <td className="py-3 px-6 text-left">{campaign.targetAudience}</td>
              <td className="py-3 px-6 text-left">{campaign.scheduledDate.toLocaleString()}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(campaign.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteCampaign(campaign.id)}
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

export default MarketingAutomation;