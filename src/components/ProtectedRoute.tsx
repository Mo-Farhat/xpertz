import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRolePermissions } from '../components/hooks/useRolePermission';
import { Loader2 } from 'lucide-react';
import { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  feature?: 'dashboard' | 'finance' | 'inventory' | 'sales' | 'reports' | 'hirePurchase' | 'manufacturing' | 'expenses';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, feature }) => {
  const { user, loading } = useAuth();
  const permissions = useRolePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (feature) {
    const hasAccess = {
      dashboard: permissions.canAccessDashboard(),
      finance: permissions.canAccessFinance(),
      inventory: permissions.canAccessInventory(),
      sales: permissions.canAccessSales(),
      reports: permissions.canAccessReports(),
      hirePurchase: permissions.canAccessHirePurchase(),
      manufacturing: permissions.canAccessManufacturing(),
      expenses: permissions.canAccessExpenses(),
    }[feature];

    if (!hasAccess) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;