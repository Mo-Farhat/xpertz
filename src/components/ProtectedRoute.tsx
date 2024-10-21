import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPlan?: 'basic' | 'professional' | 'enterprise';
  requiredRole?: 'admin' | 'user';
}

const planHierarchy = {
  basic: 0,
  professional: 1,
  enterprise: 2,
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPlan, requiredRole }) => {
  const { user, loading } = useAuth();
  const { subscriptionPlan } = useTenant();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  if (requiredPlan && subscriptionPlan) {
    const userPlanLevel = planHierarchy[subscriptionPlan as keyof typeof planHierarchy];
    const requiredPlanLevel = planHierarchy[requiredPlan];

    if (userPlanLevel < requiredPlanLevel) {
      return <Navigate to="/settings" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;