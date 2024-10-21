import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2, TrendingUp } from 'lucide-react';

interface ForecastItem {
  id: string;
  itemId: string;
  itemName: string;
  forecastDate: Date;
  predictedDemand: number;
  actualDemand?: number;
  accuracy?: number;
}

const DemandForecasting: React.FC = () => {
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
    } catch (error) {
      console.error("Error adding forecast: ", error);
    }
  };

  const handleUpdateForecast = async (id: string, updatedForecast: Partial<ForecastItem>) => {
    try {
      await updateDoc(doc(db, 'demandForecasts', id), updatedForecast);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating forecast: ", error);
    }
  };

  const handleDeleteForecast = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'demandForecasts', id));
    } catch (error) {
      console.error("Error deleting forecast: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = forecasts.map(forecast => 
      `${forecast.itemId},${forecast.itemName},${forecast.forecastDate.toISOString()},${forecast.predictedDemand},${forecast.actualDemand || ''},${forecast.accuracy || ''}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'demand_forecasts.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Demand Forecasting</h3>
      <form onSubmit={handleAddForecast} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Item ID"
            value={newForecast.itemId}
            onChange={(e) => setNewForecast({ ...newForecast, itemId: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Item Name"
            value={newForecast.itemName}
            onChange={(e) => setNewForecast({ ...newForecast, itemName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newForecast.forecastDate.toISOString().split('T')[0]}
            onChange={(e) => setNewForecast({ ...newForecast, forecastDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Predicted Demand"
            value={newForecast.predictedDemand}
            onChange={(e) => setNewForecast({ ...newForecast, predictedDemand: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Forecast
        </button>
      </form>
      <button
        onClick={handleExport}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
      >
        <Download size={18} className="mr-2" />
        Export CSV
      </button>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Item ID</th>
            <th className="py-3 px-6 text-left">Item Name</th>
            <th className="py-3 px-6 text-left">Forecast Date</th>
            <th className="py-3 px-6 text-right">Predicted Demand</th>
            <th className="py-3 px-6 text-right">Actual Demand</th>
            <th className="py-3 px-6 text-right">Accuracy</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {forecasts.map((forecast) => (
            <tr key={forecast.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{forecast.itemId}</td>
              <td className="py-3 px-6 text-left">{forecast.itemName}</td>
              <td className="py-3 px-6 text-left">{forecast.forecastDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-right">{forecast.predictedDemand}</td>
              <td className="py-3 px-6 text-right">{forecast.actualDemand || 'N/A'}</td>
              <td className="py-3 px-6 text-right">
                {forecast.accuracy ? `${forecast.accuracy.toFixed(2)}%` : 'N/A'}
              </td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(forecast.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteForecast(forecast.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DemandForecasting;