import React, { useState, useEffect } from 'react';
import { collection, setDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import WidgetGrid from './dashboard/WidgetGrid';
import ChartWidget from './dashboard/ChartWidget';
import { WidgetData, AvailableWidget } from './dashboard/types';
import { loadWidgetData, fetchSalesData, fetchTopProducts, fetchInventoryData } from './dashboard/dataFetchers';
import { useToast } from "./hooks/use-toast";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

// Default widgets that all users will see initially
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
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  // Load user preferences from Firestore when component mounts
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user?.uid) return;

      try {
        const userPrefsRef = doc(db, 'userPreferences', user.uid);
        const userPrefsDoc = await getDoc(userPrefsRef);

        if (userPrefsDoc.exists()) {
          const savedWidgets = userPrefsDoc.data().selectedWidgets;
          setSelectedWidgets(savedWidgets);
        } else {
          // Create default preferences for new users
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

  // Fetch dashboard data when selectedWidgets changes
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const widgetData = await loadWidgetData(selectedWidgets);
        setWidgets(widgetData);

        const sales = await fetchSalesData();
        setSalesData(sales);

        const products = await fetchTopProducts();
        setTopProducts(products);

        const inventory = await fetchInventoryData();
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

  const handleWidgetToggle = async (widgetId: string) => {
    try {
      const updatedWidgets = selectedWidgets.includes(widgetId)
        ? selectedWidgets.filter(id => id !== widgetId)
        : [...selectedWidgets, widgetId];
      
      setSelectedWidgets(updatedWidgets);
      
      if (user?.uid) {
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

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <Button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {isCustomizing ? 'View Dashboard' : 'Customize Dashboard'}
        </Button>
      </div>

      {isCustomizing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {availableWidgets.map(widget => (
            <div key={widget.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-700">{widget.title}</h3>
                <Checkbox
                  checked={selectedWidgets.includes(widget.id)}
                  onCheckedChange={() => handleWidgetToggle(widget.id)}
                />
              </div>
              <p className="text-gray-600">{widget.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <WidgetGrid widgets={widgets} />
          <ChartWidget
            title="Sales Trend"
            isVisible={selectedWidgets.includes('salesTrend')}
            chart={
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            }
          />

          <ChartWidget
            title="Top Products"
            isVisible={selectedWidgets.includes('topProducts')}
            chart={
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#10B981" />
              </BarChart>
            }
          />

          <ChartWidget
            title="Inventory Distribution"
            isVisible={selectedWidgets.includes('inventoryDistribution')}
            chart={
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            }
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;