export type UserRole = 'admin' | 'accountant' | 'sales' | 'inventory' | 'user';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin?: Date;
  status: 'active' | 'inactive' | 'suspended';
}

export interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setIsIntentionalLogout: (value: boolean) => void;
}