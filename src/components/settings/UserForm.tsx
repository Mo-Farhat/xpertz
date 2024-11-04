import React from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus } from 'lucide-react';
import { UserRole } from '../../types/auth';

interface UserFormProps {
  newUser: {
    email: string;
    password: string;
    role: UserRole;
  };
  setNewUser: (user: { email: string; password: string; role: UserRole }) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const UserForm: React.FC<UserFormProps> = ({ newUser, setNewUser, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex gap-4">
        <Input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
          className="flex-1"
        />
        <Input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
          className="flex-1"
          minLength={6}
        />
        <Select
          value={newUser.role}
          onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="accountant">Accountant</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>
    </form>
  );
};

export default UserForm;