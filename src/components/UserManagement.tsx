import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../firebase';
import { Plus, Download, Edit, Trash2, Mail } from 'lucide-react';
import { useToast } from "./hooks/use-toast";

interface User {
  id: string;
  email: string;
  role: 'admin' | 'accountant' | 'user';
  createdAt: Date;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ email: '', role: 'user' as const });
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as User));
      setUsers(usersData);
    });
    return unsubscribe;
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, generateTemporaryPassword());
      const user = userCredential.user;

      // Add user to Firestore with role
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date(),
      });

      // Send password reset email
      await sendPasswordResetEmail(auth, newUser.email);

      setNewUser({ email: '', role: 'user' });
      toast({
        title: "Success",
        description: "User added successfully. A password reset email has been sent.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding user: ", error);
    }
  };

  const handleUpdateUser = async (id: string, updatedUser: Partial<User>) => {
    try {
      await updateDoc(doc(db, 'users', id), updatedUser);
      toast({
        title: "Success",
        description: "User updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user.",
        variant: "destructive",
      });
      console.error("Error updating user: ", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
      console.error("Error deleting user: ", error);
    }
  };

  const generateTemporaryPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleExport = () => {
    const csvContent = users.map(user => 
      `${user.email},${user.role},${user.createdAt.toISOString()}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'users.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getNextRole = (currentRole: User['role']): User['role'] => {
    const roles: User['role'][] = ['user', 'accountant', 'admin'];
    const currentIndex = roles.indexOf(currentRole);
    return roles[(currentIndex + 1) % roles.length];
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <form onSubmit={handleAddUser} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="flex-grow p-2 border rounded"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
            className="p-2 border rounded"
          >
            <option value="user">User</option>
            <option value="accountant">Accountant</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center gap-2">
            <Plus size={20} />
            Add User
          </button>
        </div>
      </form>
      <button
        onClick={handleExport}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
      >
        <Download size={18} className="mr-2" />
        Export CSV
      </button>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Created At</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail size={18} className="mr-2" />
                    {user.email}
                  </div>
                </td>
                <td className="py-3 px-6 text-left capitalize">{user.role}</td>
                <td className="py-3 px-6 text-left">{user.createdAt.toLocaleString()}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleUpdateUser(user.id, { role: getNextRole(user.role) })}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    title="Change Role"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete User"
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

export default UserManagement;