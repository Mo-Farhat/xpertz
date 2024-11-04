import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

export const useRolePermissions = () => {
  const { user } = useAuth();

  const hasAccess = (requiredRoles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(user.role);
  };

  const canAccessSettings = (): boolean => {
    return user?.role === 'admin';
  };

  const canAccessProfile = (): boolean => {
    return user?.role === 'admin';
  };

  const canAccessFinance = (): boolean => {
    return user?.role === 'admin' || user?.role === 'accountant';
  };

  const canAccessPOS = (): boolean => {
    return true; // All users can access POS
  };

  const canAccessInventory = (): boolean => {
    return user?.role === 'admin' || user?.role === 'accountant';
  };

  const canAccessSales = (): boolean => {
    return user?.role === 'admin' || user?.role === 'accountant';
  };

  const canAccessReports = (): boolean => {
    return user?.role === 'admin' || user?.role === 'accountant';
  };

  const canAccessHirePurchase = (): boolean => {
    return user?.role === 'admin' || user?.role === 'accountant';
  };

  const canAccessManufacturing = (): boolean => {
    return user?.role === 'admin' || user?.role === 'accountant';
  };

  const canAccessExpenses = (): boolean => {
    return user?.role === 'admin' || user?.role === 'accountant';
  };

  const canAccessDashboard = (): boolean => {
    return user?.role === 'admin' || user?.role === 'accountant';
  };

  return {
    hasAccess,
    canAccessSettings,
    canAccessProfile,
    canAccessFinance,
    canAccessPOS,
    canAccessInventory,
    canAccessSales,
    canAccessReports,
    canAccessHirePurchase,
    canAccessManufacturing,
    canAccessExpenses,
    canAccessDashboard,
    userRole: user?.role
  };
};