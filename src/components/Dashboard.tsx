import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc, updateDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { DollarSign, Package, ShoppingCart, Users, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import WidgetGrid from './dashboard/WidgetGrid';
import ChartWidget from './dashboard/ChartWidget';
import { WidgetData, AvailableWidget, SalesData, ProductData, InventoryData } from './dashboard/types';
import { loadWidgetData, fetchSalesData, fetchTopProducts, fetchInventoryData } from './dashboard/dataFetchers';
import { useToast } from "../components/hooks/use-toast";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const availableWidgets: AvailableWidget[] = [
    { id: 'totalSales', title: 'Total Sales', description: 'Shows the total sales amount' },
    { id: 'inventoryCount', title: 'Inventory Count', description: 'Displays the total number of inventory items' },
    { id: 'topProducts', title: 'Top Products', description: 'Lists the top-selling products' },
    { id: 'recentOrders', title: 'Recent Orders', description: 'Shows the most recent orders' },
    { id: 'customerCount', title: 'Customer Count', description: 'Displays the total number of customers' },
    { id: 'salesTrend', title: 'Sales Trend', description: 'Shows the sales trend over time' },
    { id: 'inventoryDistribution', title: 'Inventory Distribution', description: 'Displays the distribution of inventory across categories' },
  ];

  // Load user preferences from Firestore when component mounts
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const savedWidgets = userData.selectedWidgets || [];
            setSelectedWidgets(savedWidgets);
            
            // Also update localStorage for redundancy
            localStorage.setItem(`selectedWidgets_${user.uid}`, JSON.stringify(savedWidgets));
          } else {
            // If no preferences exist in Firestore, check localStorage as fallback
            const storedWidgets = localStorage.getItem(`selectedWidgets_${user.uid}`);
            if (storedWidgets) {
              const parsedWidgets = JSON.parse(storedWidgets);
              setSelectedWidgets(parsedWidgets);
              // Save to Firestore for future sessions
              await updateDoc(doc(db, 'users', user.uid), {
                selectedWidgets: parsedWidgets,
              });
            }
          }
        } catch (err) {
          console.error("Error loading user preferences:", err);
          toast({
            title: "Error",
            description: "Failed to load dashboard preferences",
            variant: "destructive",
          });
        }
      }
    };

    loadUserPreferences();
  }, [user, toast]);

  // Fetch dashboard data when selectedWidgets changes
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user) {
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
      }
    };

    fetchDashboardData();
  }, [user, selectedWidgets, toast]);

  const handleWidgetToggle = async (widgetId: string) => {
    try {
      const updatedWidgets = selectedWidgets.includes(widgetId)
        ? selectedWidgets.filter(id => id !== widgetId)
        : [...selectedWidgets, widgetId];
      
      setSelectedWidgets(updatedWidgets);
      
      if (user) {
        // Update both Firestore and localStorage
        await updateDoc(doc(db, 'users', user.uid), {
          selectedWidgets: updatedWidgets,
        });
        localStorage.setItem(`selectedWidgets_${user.uid}`, JSON.stringify(updatedWidgets));
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

  const handleSaveCustomization = async () => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          selectedWidgets: selectedWidgets,
        });
        localStorage.setItem(`selectedWidgets_${user.uid}`, JSON.stringify(selectedWidgets));
        setIsCustomizing(false);
        
        toast({
          title: "Success",
          description: "Dashboard preferences saved successfully",
        });
      } catch (error) {
        console.error("Error saving widget customization:", error);
        toast({
          title: "Error",
          description: "Failed to save customization",
          variant: "destructive",
        });
      }
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (error) {
    return <div className="text-red-500 p-4 bg-red-100 border border-red-400 rounded">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          <Settings className="mr-2" size={18} />
          {isCustomizing ? 'Save Layout' : 'Customize Dashboard'}
        </button>
      </div>

      {isCustomizing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {availableWidgets.map(widget => (
            <div key={widget.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-700">{widget.title}</h3>
                <input
                  type="checkbox"
                  checked={selectedWidgets.includes(widget.id)}
                  onChange={() => handleWidgetToggle(widget.id)}
                  className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                />
              </div>
              <p className="text-gray-600">{widget.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
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
        </>
      )}

      {isCustomizing && (
        <button
          onClick={handleSaveCustomization}
          className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default Dashboard;