import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Features from './components/Features';
import FeatureManagement from './components/FeatureManagement';
import UserProfile from './components/UserProfile';
import UserManagement from './components/UserManagement';
import Reports from './components/Reports';
import Calendar from './components/features/Calendar';
import CRM from './components/features/CRM';
import PointOfSale from './components/features/PointOfSale';
import Project from './components/features/Project';
import Timesheets from './components/features/Timesheets';
import Planning from './components/features/Planning';
import Surveys from './components/features/Surveys';
import Purchase from './components/features/Purchase';
import Manufacturing from './components/features/Manufacturing';
import ShopFloor from './components/features/ShopFloor';
import Barcode from './components/features/Barcode';
import Expenses from './components/features/Expenses';
import FinanceAndAccounting from './components/features/FinanceAndAccounting';
import HRManagement from './components/features/HRManagement';
import InventorySupplyChain from './components/features/InventorySupplyChain';
import SalesOrderManagement from './components/features/SalesOrderManagement';
import Inventory from './components/features/Inventory';
import { SalesProvider } from './components/features/PointOfSale/SalesContext';
import HirePurchasing from './components/features/PointOfSale/HirePurchasing';
import HirePurchaseAgreements from './components/HirePurchaseAgreements';
import Auth from './components/Auth';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route for login */}
          <Route path="/login" element={<Auth />} />
          
          <Route path="/features" element={
            <ProtectedRoute>
              <Features />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
            <Route path="/contacts" element={
              <ProtectedRoute>
                <Layout>
                  <Contacts />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/inventory-supply-chain" element={
              <ProtectedRoute>
                <Layout>
                  <InventorySupplyChain />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/sales" element={
              <ProtectedRoute>
                <Layout>
                  <SalesOrderManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <UserProfile />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/manage-features" element={
              <ProtectedRoute>
                <Layout>
                  <FeatureManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/user-management" element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Feature routes */}
            <Route path="/calendar" element={
              <ProtectedRoute>
                <Layout>
                  <Calendar />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/crm" element={
              <ProtectedRoute>
                <Layout>
                  <CRM />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/point-of-sale" element={
              <ProtectedRoute>
                <Layout>
                  <SalesProvider>
                    <PointOfSale />
                  </SalesProvider>
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/point-of-sale/hire-purchasing" element={
              <ProtectedRoute>
                <Layout>
                  <SalesProvider>
                    <HirePurchasing />
                  </SalesProvider>
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/finance-and-accounting" element={
              <ProtectedRoute>
                <Layout>
                  <FinanceAndAccounting />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/project" element={
              <ProtectedRoute>
                <Layout>
                  <Project />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/timesheets" element={
              <ProtectedRoute>
                <Layout>
                  <Timesheets />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/planning" element={
              <ProtectedRoute>
                <Layout>
                  <Planning />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/surveys" element={
              <ProtectedRoute>
                <Layout>
                  <Surveys />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/purchase" element={
              <ProtectedRoute>
                <Layout>
                  <Purchase />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/manufacturing" element={
              <ProtectedRoute>
                <Layout>
                  <Manufacturing />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/shop-floor" element={
              <ProtectedRoute>
                <Layout>
                  <ShopFloor />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/barcode" element={
              <ProtectedRoute>
                <Layout>
                  <Barcode />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/hire-purchase" element={
              <ProtectedRoute>
                <Layout>
                  <HirePurchaseAgreements />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/hr-management" element={
              <ProtectedRoute>
                <Layout>
                  <HRManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/expenses" element={
              <ProtectedRoute>
                <Layout>
                  <Expenses />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/inventory" element={
              <ProtectedRoute>
                <Layout>
                  <Inventory />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all unmatched routes and redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
};

export default App;
