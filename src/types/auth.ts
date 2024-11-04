export type UserRole = 'admin' | 'accountant' | 'user';

export interface UserData {
  uid: string;
  email: string | null;
  role: UserRole;
  createdAt: Date;
}

export interface AuthContextType {
  user: UserData | null;
  loading: boolean;
}