import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

interface Tenant {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  setTenant: React.Dispatch<React.SetStateAction<Tenant | null>>;
  subscriptionPlan: string | null;
  setSubscriptionPlan: React.Dispatch<React.SetStateAction<string | null>>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider: React.FC = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTenantAndSubscription = async () => {
      if (user) {
        // Fetch user's subscription plan
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setSubscriptionPlan(userDoc.data().subscriptionPlan);
        }

        // Fetch tenant information
        // In a real multi-tenant system, you'd determine the tenant ID dynamically
        // For this example, we'll use a hardcoded tenant ID
        const tenantId = 'default-tenant';
        const tenantDoc = await getDoc(doc(collection(db, 'tenants'), tenantId));
        
        if (tenantDoc.exists()) {
          setTenant({ id: tenantDoc.id, ...tenantDoc.data() } as Tenant);
        }
      }
    };

    fetchTenantAndSubscription();
  }, [user]);

  return (
    <TenantContext.Provider value={{ tenant, setTenant, subscriptionPlan, setSubscriptionPlan }}>
      {children}
    </TenantContext.Provider>
  );
};

export default TenantProvider;