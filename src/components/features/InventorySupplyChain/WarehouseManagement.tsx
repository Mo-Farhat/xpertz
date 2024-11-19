import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import LocationForm from './Warehouse/LocationForm';
import LocationList from './Warehouse/LocationList';
import WarehouseLocationsMap from './Warehouse/WarehouseLocationsMap';
import { useToast } from "../../hooks/use-toast";
import { LocationFormData, WarehouseLocation } from './Warehouse/types';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

const WarehouseManagement = () => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<WarehouseLocation[]>([]);
  const [editingLocation, setEditingLocation] = useState<LocationFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'warehouseLocations'));
        const locationData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WarehouseLocation[];
        setLocations(locationData);
      } catch (error) {
        console.error('Error fetching locations:', error);
        toast({
          title: "Error",
          description: "Failed to load warehouse locations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [toast]);

  const handleSubmit = async (formData: LocationFormData) => {
    try {
      if (formData.id) {
        const { id, ...updateData } = formData;
        await updateDoc(doc(db, 'warehouseLocations', id), updateData);
        setLocations(prev => prev.map(loc => 
          loc.id === id ? { ...loc, ...updateData } : loc
        ));
        toast({
          title: "Success",
          description: "Location updated successfully",
        });
      } else {
        const docRef = await addDoc(collection(db, 'warehouseLocations'), formData);
        setLocations(prev => [...prev, { ...formData, id: docRef.id }]);
        toast({
          title: "Success",
          description: "Location added successfully",
        });
      }
      setEditingLocation(null);
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: "Error",
        description: "Failed to save location",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'warehouseLocations', id));
      setLocations(prev => prev.filter(loc => loc.id !== id));
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <LocationForm
            onSubmit={handleSubmit}
            initialData={editingLocation}
          />

          <TabsContent value="list" className="space-y-6">
            <LocationList
              locations={locations}
              onEdit={setEditingLocation}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="map">
            <WarehouseLocationsMap locations={locations} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WarehouseManagement;