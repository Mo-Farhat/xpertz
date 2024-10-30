import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AuthContextType, UserData } from '../types/auth';
import { useToast } from "../components/hooks/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isIntentionalLogout, setIsIntentionalLogout] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: userData.role || 'user',
              createdAt: userData.createdAt?.toDate() || new Date(),
            });
          } else {
            setUser(null);
          }
          setIsIntentionalLogout(false);
        } else {
          setUser(null);
          // Only show error toast if it's not an intentional logout
          if (!isIntentionalLogout) {
            toast({
              title: "Error",
              description: "Failed to load user data",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (!isIntentionalLogout) {
          toast({
            title: "Error",
            description: "Failed to load user data",
            variant: "destructive",
          });
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [toast, isIntentionalLogout]);

  const value = {
    user,
    loading,
    setIsIntentionalLogout, // Add this to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};