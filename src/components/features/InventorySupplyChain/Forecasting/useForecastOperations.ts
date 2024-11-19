import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where, Timestamp, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useToast } from "../../../hooks/use-toast";
import { ForecastItem } from './types';
import { generateAutomatedForecast } from './forecastUtils';

export const useForecastOperations = () => {
  const { toast } = useToast();
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);
  const [newForecast, setNewForecast] = useState<Omit<ForecastItem, 'id'>>({
    itemId: '',
    itemName: '',
    forecastDate: new Date(),
    predictedDemand: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'demandForecasts'), orderBy('forecastDate', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const forecastData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        forecastDate: doc.data().forecastDate.toDate(),
      } as ForecastItem));
      setForecasts(forecastData);
    });
    return unsubscribe;
  }, []);

  const handleAddForecast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'demandForecasts'), {
        ...newForecast,
        forecastDate: new Date(newForecast.forecastDate),
      });
      setNewForecast({
        itemId: '',
        itemName: '',
        forecastDate: new Date(),
        predictedDemand: 0,
      });
      toast({
        title: "Success",
        description: "Forecast added successfully",
      });
    } catch (error) {
      console.error("Error adding forecast: ", error);
      toast({
        title: "Error",
        description: "Failed to add forecast",
        variant: "destructive",
      });
    }
  };

  const handleUpdateForecast = async (id: string, updatedForecast: Partial<ForecastItem>) => {
    try {
      await updateDoc(doc(db, 'demandForecasts', id), updatedForecast);
      setEditingId(null);
      toast({
        title: "Success",
        description: "Forecast updated successfully",
      });
    } catch (error) {
      console.error("Error updating forecast: ", error);
      toast({
        title: "Error",
        description: "Failed to update forecast",
        variant: "destructive",
      });
    }
  };

  const handleDeleteForecast = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this forecast?')) return;
    
    try {
      await deleteDoc(doc(db, 'demandForecasts', id));
      toast({
        title: "Success",
        description: "Forecast deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting forecast: ", error);
      toast({
        title: "Error",
        description: "Failed to delete forecast",
        variant: "destructive",
      });
    }
  };

  const handleAutoGenerate = async () => {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 12);
      
      const historicalQuery = query(
        collection(db, 'demandForecasts'),
        where('forecastDate', '>=', Timestamp.fromDate(startDate)),
        orderBy('forecastDate', 'desc')
      );
      
      const historicalSnapshot = await getDocs(historicalQuery);
      const historicalData = historicalSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        forecastDate: doc.data().forecastDate.toDate(),
      })) as ForecastItem[];

      const uniqueItems = new Set(historicalData.map(item => item.itemId));
      
      for (const itemId of uniqueItems) {
        const itemData = historicalData.filter(item => item.itemId === itemId);
        if (itemData.length > 0) {
          const itemName = itemData[0].itemName;
          const autoForecast = generateAutomatedForecast(itemData, itemId, itemName);
          await addDoc(collection(db, 'demandForecasts'), autoForecast);
        }
      }

      toast({
        title: "Success",
        description: "Automated forecasts generated successfully",
      });
    } catch (error) {
      console.error("Error generating automated forecasts:", error);
      toast({
        title: "Error",
        description: "Failed to generate automated forecasts",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Item ID', 'Item Name', 'Forecast Date', 'Predicted Demand', 'Actual Demand', 'Accuracy'],
      ...forecasts.map(forecast => [
        forecast.itemId,
        forecast.itemName,
        forecast.forecastDate.toISOString(),
        forecast.predictedDemand,
        forecast.actualDemand || '',
        forecast.accuracy ? `${forecast.accuracy.toFixed(2)}%` : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'demand_forecasts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    forecasts,
    newForecast,
    setNewForecast,
    editingId,
    setEditingId,
    handleAddForecast,
    handleUpdateForecast,
    handleDeleteForecast,
    handleAutoGenerate,
    handleExport
  };
};