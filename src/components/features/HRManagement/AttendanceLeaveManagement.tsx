import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Save, Trash2 } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: Date;
  endDate: Date;
  leaveType: 'sick' | 'vacation' | 'personal' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

const AttendanceLeaveManagement: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [newAttendance, setNewAttendance] = useState<Omit<AttendanceRecord, 'id'>>({
    employeeId: '',
    employeeName: '',
    date: new Date(),
    checkIn: '',
    checkOut: '',
    status: 'present',
  });
  const [newLeave, setNewLeave] = useState<Omit<LeaveRequest, 'id'>>({
    employeeId: '',
    employeeName: '',
    startDate: new Date(),
    endDate: new Date(),
    leaveType: 'sick',
    status: 'pending',
    reason: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const attendanceQuery = query(collection(db, 'attendance'), orderBy('date', 'desc'));
    const leaveQuery = query(collection(db, 'leaveRequests'), orderBy('startDate', 'desc'));

    const unsubscribeAttendance = onSnapshot(attendanceQuery, (querySnapshot) => {
      const records = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      } as AttendanceRecord));
      setAttendanceRecords(records);
    });

    const unsubscribeLeave = onSnapshot(leaveQuery, (querySnapshot) => {
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
      } as LeaveRequest));
      setLeaveRequests(requests);
    });

    return () => {
      unsubscribeAttendance();
      unsubscribeLeave();
    };
  }, []);

  const handleAddAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'attendance'), {
        ...newAttendance,
        date: new Date(newAttendance.date),
      });
      setNewAttendance({
        employeeId: '',
        employeeName: '',
        date: new Date(),
        checkIn: '',
        checkOut: '',
        status: 'present',
      });
    } catch (error) {
      console.error("Error adding attendance record: ", error);
    }
  };

  const handleAddLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'leaveRequests'), {
        ...newLeave,
        startDate: new Date(newLeave.startDate),
        endDate: new Date(newLeave.endDate),
      });
      setNewLeave({
        employeeId: '',
        employeeName: '',
        startDate: new Date(),
        endDate: new Date(),
        leaveType: 'sick',
        status: 'pending',
        reason: '',
      });
    } catch (error) {
      console.error("Error adding leave request: ", error);
    }
  };

  const handleUpdateAttendance = async (id: string, updatedRecord: Partial<AttendanceRecord>) => {
    try {
      await updateDoc(doc(db, 'attendance', id), updatedRecord);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating attendance record: ", error);
    }
  };

  const handleUpdateLeave = async (id: string, updatedRequest: Partial<LeaveRequest>) => {
    try {
      await updateDoc(doc(db, 'leaveRequests', id), updatedRequest);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating leave request: ", error);
    }
  };

  const handleDeleteAttendance = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'attendance', id));
    } catch (error) {
      console.error("Error deleting attendance record: ", error);
    }
  };

  const handleDeleteLeave = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'leaveRequests', id));
    } catch (error) {
      console.error("Error deleting leave request: ", error);
    }
  };

  const handleExportAttendance = () => {
    const csvContent = attendanceRecords.map(record => 
      `${record.employeeName},${record.date.toISOString()},${record.checkIn},${record.checkOut},${record.status}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'attendance_records.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportLeave = () => {
    const csvContent = leaveRequests.map(request => 
      `${request.employeeName},${request.startDate.toISOString()},${request.endDate.toISOString()},${request.leaveType},${request.status},${request.reason}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'leave_requests.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Attendance & Leave Management</h3>
      
      {/* Attendance Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-2">Attendance</h4>
        <form onSubmit={handleAddAttendance} className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Employee ID"
              value={newAttendance.employeeId}
              onChange={(e) => setNewAttendance({ ...newAttendance, employeeId: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Employee Name"
              value={newAttendance.employeeName}
              onChange={(e) => setNewAttendance({ ...newAttendance, employeeName: etarget.value })}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={newAttendance.date.toISOString().split('T')[0]}
              onChange={(e) => setNewAttendance({ ...newAttendance, date: new Date(e.target.value) })}
              className="p-2 border rounded"
            />
            <input
              type="time"
              placeholder="Check In"
              value={newAttendance.checkIn}
              onChange={(e) => setNewAttendance({ ...newAttendance, checkIn: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="time"
              placeholder="Check Out"
              value={newAttendance.checkOut}
              onChange={(e) => setNewAttendance({ ...newAttendance, checkOut: e.target.value })}
              className="p-2 border rounded"
            />
            <select
              value={newAttendance.status}
              onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value as AttendanceRecord['status'] })}
              className="p-2 border rounded"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <Plus size={24} /> Add Attendance Record
          </button>
        </form>
        <button
          onClick={handleExportAttendance}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Download size={18} className="mr-2" />
          Export Attendance CSV
        </button>
        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Employee</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Check In</th>
              <th className="py-3 px-6 text-left">Check Out</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {attendanceRecords.map((record) => (
              <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{record.employeeName}</td>
                <td className="py-3 px-6 text-left">{record.date.toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">{record.checkIn}</td>
                <td className="py-3 px-6 text-left">{record.checkOut}</td>
                <td className="py-3 px-6 text-left">
                  <span className={`py-1 px-3 rounded-full text-xs ${
                    record.status === 'present' ? 'bg-green-200 text-green-800' :
                    record.status === 'absent' ? 'bg-red-200 text-red-800' :
                    record.status === 'late' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => setEditingId(record.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteAttendance(record.id)}
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

      {/* Leave Section */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Leave Requests</h4>
        <form onSubmit={handleAddLeave} className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Employee ID"
              value={newLeave.employeeId}
              onChange={(e) => setNewLeave({ ...newLeave, employeeId: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Employee Name"
              value={newLeave.employeeName}
              onChange={(e) => setNewLeave({ ...newLeave, employeeName: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="date"
              placeholder="Start Date"
              value={newLeave.startDate.toISOString().split('T')[0]}
              onChange={(e) => setNewLeave({ ...newLeave, startDate: new Date(e.target.value) })}
              className="p-2 border rounded"
            />
            <input
              type="date"
              placeholder="End Date"
              value={newLeave.endDate.toISOString().split('T')[0]}
              onChange={(e) => setNewLeave({ ...newLeave, endDate: new Date(e.target.value) })}
              className="p-2 border rounded"
            />
            <select
              value={newLeave.leaveType}
              onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value as LeaveRequest['leaveType'] })}
              className="p-2 border rounded"
            >
              <option value="sick">Sick Leave</option>
              <option value="vacation">Vacation</option>
              <option value="personal">Personal Leave</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              placeholder="Reason"
              value={newLeave.reason}
              onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <Plus size={24} /> Add Leave Request
          </button>
        </form>
        <button
          onClick={handleExportLeave}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Download size={18} className="mr-2" />
          Export Leave Requests CSV
        </button>
        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Employee</th>
              <th className="py-3 px-6 text-left">Start Date</th>
              <th className="py-3 px-6 text-left">End Date</th>
              <th className="py-3 px-6 text-left">Leave Type</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Reason</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {leaveRequests.map((request) => (
              <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{request.employeeName}</td>
                <td className="py-3 px-6 text-left">{request.startDate.toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">{request.endDate.toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">{request.leaveType}</td>
                <td className="py-3 px-6 text-left">
                  <span className={`py-1 px-3 rounded-full text-xs ${
                    request.status === 'approved' ? 'bg-green-200 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">{request.reason}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => setEditingId(request.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteLeave(request.id)}
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
    </div>
  );
};

export default AttendanceLeaveManagement;