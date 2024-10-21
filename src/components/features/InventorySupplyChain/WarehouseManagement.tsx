import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Trash2 } from 'lucide-react';

interface WarehouseLocation {
  id: string;
  name: string;
  type: 'shelf' | 'bin' | 'pallet' | 'other';
  capacity: number;
  currentOccupancy: number;
}

interface InventoryMovement {
  id: string;
  itemId: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  date: Date;
  reason: string;
}

const WarehouseManagement: React.FC = () => {
  const [locations, setLocations] = useState<WarehouseLocation[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [newLocation, setNewLocation] = useState<Omit<WarehouseLocation, 'id'>>({
    name: '',
    type: 'shelf',
    capacity: 0,
    currentOccupancy: 0,
  });
  const [newMovement, setNewMovement] = useState<Omit<InventoryMovement, 'id'>>({
    itemId: '',
    fromLocation: '',
    toLocation: '',
    quantity: 0,
    date: new Date(),
    reason: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const locationsQuery = query(collection(db, 'warehouseLocations'), orderBy('name'));
    const unsubscribeLocations = onSnapshot(locationsQuery, (querySnapshot) => {
      const locationData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as WarehouseLocation));
      setLocations(locationData);
    });

    const movementsQuery = query(collection(db, 'inventoryMovements'), orderBy('date', 'desc'));
    const unsubscribeMovements = onSnapshot(movementsQuery, (querySnapshot) => {
      const movementData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      } as InventoryMovement));
      setMovements(movementData);
    });

    return () => {
      unsubscribeLocations();
      unsubscribeMovements();
    };
  }, []);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'warehouseLocations'), newLocation);
      setNewLocation({
        name: '',
        type: 'shelf',
        capacity: 0,
        currentOccupancy: 0,
      });
    } catch (error) {
      console.error("Error adding warehouse location: ", error);
    }
  };

  const handleAddMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'inventoryMovements'), {
        ...newMovement,
        date: new Date(newMovement.date),
      });
      setNewMovement({
        itemId: '',
        fromLocation: '',
        toLocation: '',
        quantity: 0,
        date: new Date(),
        reason: '',
      });
    } catch (error) {
      console.error("Error adding inventory movement: ", error);
    }
  };

  const handleUpdateLocation = async (id: string, updatedLocation: Partial<WarehouseLocation>) => {
    try {
      await updateDoc(doc(db, 'warehouseLocations', id), updatedLocation);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating warehouse location: ", error);
    }
  };

  const handleUpdateMovement = async (id: string, updatedMovement: Partial<InventoryMovement>) => {
    try {
      await updateDoc(doc(db, 'inventoryMovements', id), updatedMovement);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating inventory movement: ", error);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'warehouseLocations', id));
    } catch (error) {
      console.error("Error deleting warehouse location: ", error);
    }
  };

  const handleDeleteMovement = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inventoryMovements', id));
    } catch (error) {
      console.error("Error deleting inventory movement: ", error);
    }
  };

  const handleExportLocations = () => {
    const csvContent = locations.map(location => 
      `${location.name},${location.type},${location.capacity},${location.currentOccupancy}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'warehouse_locations.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportMovements = () => {
    const csvContent = movements.map(movement => 
      `${movement.itemId},${movement.fromLocation},${movement.toLocation},${movement.quantity},${movement.date.toISOString()},${movement.reason}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'inventory_movements.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Warehouse Management</h3>
      
      {/* Warehouse Locations Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-2">Warehouse Locations</h4>
        <form onSubmit={handleAddLocation} className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Location Name"
              value={newLocation.name}
              onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
              className="p-2 border rounded"
            />
            <select
              value={newLocation.type}
              onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value as WarehouseLocation['type'] })}
              className="p-2 border rounded"
            >
              <option value="shelf">Shelf</option>
              <option value="bin">Bin</option>
              <option value="pallet">Pallet</option>
              <option value="other">Other</option>
            </select>
            <input
              type="number"
              placeholder="Capacity"
              value={newLocation.capacity}
              onChange={(e) => setNewLocation({ ...newLocation, capacity: parseInt(e.target.value) })}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Current Occupancy"
              value={newLocation.currentOccupancy}
              onChange={(e) => setNewLocation({ ...newLocation, currentOccupancy: parseInt(e.target.value) })}
              className="p-2 border rounded"
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <Plus size={24} /> Add Location
          </button>
        </form>
        <button
          onClick={handleExportLocations}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Download size={18} className="mr-2" />
          Export Locations CSV
        </button>
        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-right">Capacity</th>
              <th className="py-3 px-6 text-right">Current Occupancy</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {locations.map((location) => (
              <tr key={location.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{location.name}</td>
                <td className="py-3 px-6 text-left">{location.type}</td>
                <td className="py-3 px-6 text-right">{location.capacity}</td>
                <td className="py-3 px-6 text-right">{location.currentOccupancy}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => setEditingId(location.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteLocation(location.id)}
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

      {/* Inventory Movements Section */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Inventory Movements</h4>
        <form onSubmit={handleAddMovement} className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item ID"
              value={newMovement.itemId}
              onChange={(e) => setNewMovement({ ...newMovement, itemId: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="From Location"
              value={newMovement.fromLocation}
              onChange={(e) => setNewMovement({ ...newMovement, fromLocation: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="To Location"
              value={newMovement.toLocation}
              onChange={(e) => setNewMovement({ ...newMovement, toLocation: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newMovement.quantity}
              onChange={(e) => setNewMovement({ ...newMovement, quantity: parseInt(e.target.value) })}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={newMovement.date.toISOString().split('T')[0]}
              onChange={(e) => setNewMovement({ ...newMovement, date: new Date(e.target.value) })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Reason"
              value={newMovement.reason}
              onChange={(e) => setNewMovement({ ...newMovement, reason: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <Plus size={24} /> Add Movement
          </button>
        </form>
        <button
          onClick={handleExportMovements}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Download size={18} className="mr-2" />
          Export Movements CSV
        </button>
        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Item ID</th>
              <th className="py-3 px-6 text-left">From</th>
              <th className="py-3 px-6 text-left">To</th>
              <th className="py-3 px-6 text-right">Quantity</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Reason</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {movements.map((movement) => (
              <tr key={movement.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{movement.itemId}</td>
                <td className="py-3 px-6 text-left">{movement.fromLocation}</td>
                <td className="py-3 px-6 text-left">{movement.toLocation}</td>
                <td className="py-3 px-6 text-right">{movement.quantity}</td>
                <td className="py-3 px-6 text-left">{movement.date.toLocaleDateString()}</td>
                <td className="py-3 px-6 text-left">{movement.reason}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => setEditingId(movement.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteMovement(movement.id)}
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
    </div>
  );
};

export default WarehouseManagement;