import React, { useState, useEffect } from 'react';
import { collection, setDoc, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useToast } from "../components/hooks/use-toast";
import { UserRole } from '../types/auth';
import UserForm from './settings/UserForm';
import UsersTable from './settings/UsersTable';

interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'user' as UserRole
  });
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      
      // Create user document in Firestore using the auth UID
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date(),
      });

      setNewUser({ email: '', password: '', role: 'user' });
      toast({
        title: "Success",
        description: "User added successfully",
      });
    } catch (error: any) {
      console.error("Error adding user: ", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      await setDoc(doc(db, 'users', userId), { role: newRole }, { merge: true });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>
      <UserForm
        newUser={newUser}
        setNewUser={setNewUser}
        onSubmit={handleAddUser}
      />
      <UsersTable
        users={users}
        onUpdateRole={handleUpdateRole}
      />
    </div>
  );
};

export default UserManagement;