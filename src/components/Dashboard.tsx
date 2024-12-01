import React, { useState, useEffect } from 'react';
import { collection, setDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from "./hooks/use-toast";
import { WidgetData, AvailableWidget, SalesData, ProductData, InventoryData } from './dashboard/types';
import { loadWidgetData, fetchSalesData, fetchTopProducts, fetchInventoryData } from './dashboard/dataFetchers';
import DashboardHeader from './dashboard/DashboardHeader';
import CustomizeWidgets from './dashboard/CustomizeWidgets';
import WidgetGrid from './dashboard/WidgetGrid';
import DashboardCharts from './dashboard/DashboardCharts';
import NotificationsPopover from './dashboard/NotificationsPopover';
import { Notification } from '../types/notification';
import { subscribeToNotifications, markNotificationAsRead, markAllNotificationsAsRead } from './services/notificationService';
import { Button } from "./ui/button";
import { Settings } from "lucide-react";

const DEFAULT_WIDGETS = [
  'totalSales',
  'inventoryCount',
  'topProducts',
  'recentOrders',
  'customerCount'
];

const availableWidgets: AvailableWidget[] = [
  { id: 'totalSales', title: 'Total Sales', description: 'Shows the total sales amount' },
  { id: 'inventoryCount', title: 'Inventory Count', description: 'Displays the total number of inventory items' },
  { id: 'topProducts', title: 'Top Products', description: 'Lists the top-selling products' },
  { id: 'recentOrders', title: 'Recent Orders', description: 'Shows the most recent orders' },
  { id: 'customerCount', title: 'Customer Count', description: 'Displays the total number of customers' },
  { id: 'salesTrend', title: 'Sales Trend', description: 'Shows the sales trend over time' },
  { id: 'inventoryDistribution', title: 'Inventory Distribution', description: 'Displays the distribution of inventory across categories' },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(DEFAULT_WIDGETS);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadUserPreferences = async () => {
      console.log('Loading user preferences for user:', user?.uid);
      if (!user?.uid) return;

      try {
        const userPrefsRef = doc(db, 'userPreferences', user.uid);
        const userPrefsDoc = await getDoc(userPrefsRef);
        
        if (userPrefsDoc.exists()) {
          const savedWidgets = userPrefsDoc.data().selectedWidgets;
          console.log('Loaded saved widget preferences:', savedWidgets);
          setSelectedWidgets(savedWidgets);
        } else {
          console.log('No existing preferences found, creating defaults');
          await setDoc(userPrefsRef, {
            selectedWidgets: DEFAULT_WIDGETS,
            createdAt: new Date()
          });
          setSelectedWidgets(DEFAULT_WIDGETS);
        }
      } catch (err) {
        console.error("Error loading user preferences:", err);
        toast({
          title: "Note",
          description: "Using default dashboard layout",
        });
      }
    };

    loadUserPreferences();
  }, [user, toast]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('Fetching dashboard data for widgets:', selectedWidgets);
      try {
        const widgetData = await loadWidgetData(selectedWidgets);
        console.log('Loaded widget data:', widgetData);
        setWidgets(widgetData);

        const sales = await fetchSalesData();
        console.log('Loaded sales data:', sales);
        setSalesData(sales);

        const products = await fetchTopProducts();
        console.log('Loaded top products:', products);
        setTopProducts(products);

        const inventory = await fetchInventoryData();
        console.log('Loaded inventory data:', inventory);
        setInventoryData(inventory);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      }
    };

    fetchDashboardData();
  }, [selectedWidgets, toast]);

  useEffect(() => {
    if (!user?.uid) return;
    console.log('Subscribing to notifications for user:', user.uid);
    const unsubscribe = subscribeToNotifications(user.uid, (newNotifications) => {
      console.log('Received new notifications:', newNotifications);
      setNotifications(newNotifications);
    });
    return () => unsubscribe();
  }, [user]);

  const handleWidgetToggle = async (widgetId: string) => {
    console.log('Toggling widget:', widgetId);
    try {
      const updatedWidgets = selectedWidgets.includes(widgetId)
        ? selectedWidgets.filter(id => id !== widgetId)
        : [...selectedWidgets, widgetId];
      
      console.log('Updated widget selection:', updatedWidgets);
      setSelectedWidgets(updatedWidgets);
      
      if (user?.uid) {
        console.log('Saving widget preferences to Firestore');
        await setDoc(doc(db, 'userPreferences', user.uid), {
          selectedWidgets: updatedWidgets,
          updatedAt: new Date()
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error toggling widget:", error);
      toast({
        title: "Error",
        description: "Failed to update widget selection",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      console.log('Marking notification as read:', notificationId);
      await markNotificationAsRead(notificationId);
      toast({
        title: "Success",
        description: "Notification marked as read"
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.uid) return;
    
    try {
      console.log('Marking all notifications as read for user:', user.uid);
      await markAllNotificationsAsRead(user.uid);
      toast({
        title: "Success",
        description: "All notifications marked as read"
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <div className="flex items-center gap-4">
          <NotificationsPopover
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
          <Button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {isCustomizing ? 'View Dashboard' : 'Customize Dashboard'}
          </Button>
        </div>
      </div>

      {isCustomizing ? (
        <CustomizeWidgets
          availableWidgets={availableWidgets}
          selectedWidgets={selectedWidgets}
          onWidgetToggle={handleWidgetToggle}
        />
      ) : (
        <div className="space-y-6">
          <WidgetGrid widgets={widgets} />
          <DashboardCharts
            selectedWidgets={selectedWidgets}
            salesData={salesData}
            topProducts={topProducts}
            inventoryData={inventoryData}
            colors={COLORS}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;