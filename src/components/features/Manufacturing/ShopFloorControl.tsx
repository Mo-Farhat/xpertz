import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2 } from 'lucide-react';

interface ShopFloorActivity {
  id: string;
  workOrderId: string;
  machineId: string;
  operatorId: string;
  startTime: Date;
  endTime: Date | null;
  status: 'in-progress' | 'completed' | 'paused';
  output: number;
  notes: string;
}

const ShopFloorControl: React.FC = () => {
  const [activities, setActivities] = useState<ShopFloorActivity[]>([]);
  const [newActivity, setNewActivity] = useState<Omit<ShopFloorActivity, 'id'>>({
    workOrderId: '',
    machineId: '',
    operatorId: '',
    startTime: new Date(),
    endTime: null,
    status: 'in-progress',
    output: 0,
    notes: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'shopFloorActivities'), orderBy('startTime', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const activityData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime ? doc.data().endTime.toDate() : null,
      } as ShopFloorActivity));
      setActivities(activityData);
    });
    return unsubscribe;
  }, []);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'shopFloorActivities'), {
        ...newActivity,
        startTime: new Date(newActivity.startTime),
        endTime: newActivity.endTime ? new Date(newActivity.endTime) : null,
      });
      setNewActivity({
        workOrderId: '',
        machineId: '',
        operatorId: '',
        startTime: new Date(),
        endTime: null,
        status: 'in-progress',
        output: 0,
        notes: '',
      });
    } catch (error) {
      console.error("Error adding shop floor activity: ", error);
    }
  };

  const handleUpdateActivity = async (id: string, updatedActivity: Partial<ShopFloorActivity>) => {
    try {
      await updateDoc(doc(db, 'shopFloorActivities', id), updatedActivity);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating shop floor activity: ", error);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'shopFloorActivities', id));
    } catch (error) {
      console.error("Error deleting shop floor activity: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = activities.map(activity => 
      `${activity.workOrderId},${activity.machineId},${activity.operatorId},${activity.startTime.toISOString()},${activity.endTime ? activity.endTime.toISOString() : ''},${activity.status},${activity.output},${activity.notes}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'shop_floor_activities.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Shop Floor Control</h3>
      <form onSubmit={handleAddActivity} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Work Order ID"
            value={newActivity.workOrderId}
            onChange={(e) => setNewActivity({ ...newActivity, workOrderId: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Machine ID"
            value={newActivity.machineId}
            onChange={(e) => setNewActivity({ ...newActivity, machineId: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Operator ID"
            value={newActivity.operatorId}
            onChange={(e) => setNewActivity({ ...newActivity, operatorId: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="datetime-local"
            value={newActivity.startTime.toISOString().slice(0, 16)}
            onChange={(e) => setNewActivity({ ...newActivity, startTime: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="datetime-local"
            value={newActivity.endTime ? newActivity.endTime.toISOString().slice(0, 16) : ''}
            onChange={(e) => setNewActivity({ ...newActivity, endTime: e.target.value ? new Date(e.target.value) : null })}
            className="p-2 border rounded"
          />
          <select
            value={newActivity.status}
            onChange={(e) => setNewActivity({ ...newActivity, status: e.target.value as ShopFloorActivity['status'] })}
            className="p-2 border rounded"
          >
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
          <input
            type="number"
            placeholder="Output"
            value={newActivity.output}
            onChange={(e) => setNewActivity({ ...newActivity, output: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Notes"
            value={newActivity.notes}
            onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Activity
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
            <th className="py-3 px-6 text-left">Work Order ID</th>
            <th className="py-3 px-6 text-left">Machine ID</th>
            <th className="py-3 px-6 text-left">Operator ID</th>
            <th className="py-3 px-6 text-left">Start Time</th>
            <th className="py-3 px-6 text-left">End Time</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-right">Output</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {activities.map((activity) => (
            <tr key={activity.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{activity.workOrderId}</td>
              <td className="py-3 px-6 text-left">{activity.machineId}</td>
              <td className="py-3 px-6 text-left">{activity.operatorId}</td>
              <td className="py-3 px-6 text-left">{activity.startTime.toLocaleString()}</td>
              <td className="py-3 px-6 text-left">{activity.endTime ? activity.endTime.toLocaleString() : 'N/A'}</td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  activity.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
                  activity.status === 'completed' ? 'bg-green-200 text-green-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {activity.status}
                </span>
              </td>
              <td className="py-3 px-6 text-right">{activity.output}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(activity.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteActivity(activity.id)}
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

export default ShopFloorControl;