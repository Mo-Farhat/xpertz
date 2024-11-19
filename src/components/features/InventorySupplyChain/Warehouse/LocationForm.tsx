import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { LocationFormData, LocationType, LocationStatus } from './types';
import { useToast } from "../../../hooks/use-toast";

interface LocationFormProps {
  onSubmit: (location: LocationFormData) => Promise<void>;
  initialData?: LocationFormData;
}

const LocationForm: React.FC<LocationFormProps> = ({ onSubmit, initialData }) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<LocationFormData>(initialData || {
    name: '',
    type: 'shelf',
    capacity: 0,
    currentOccupancy: 0,
    status: 'active',
    zone: '',
    latitude: 0,
    longitude: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.currentOccupancy > formData.capacity) {
      toast({
        title: "Validation Error",
        description: "Current occupancy cannot exceed capacity",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
      if (!initialData) {
        setFormData({
          name: '',
          type: 'shelf',
          capacity: 0,
          currentOccupancy: 0,
          status: 'active',
          zone: '',
          latitude: 0,
          longitude: 0
        });
      }
      toast({
        title: "Success",
        description: initialData ? "Location updated successfully" : "Location added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save location",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Location Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <Select 
          value={formData.type} 
          onValueChange={(value: LocationType) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shelf">Shelf</SelectItem>
            <SelectItem value="bin">Bin</SelectItem>
            <SelectItem value="pallet">Pallet</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="Zone (Optional)"
          value={formData.zone}
          onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
        />

        <Input
          type="number"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
          required
          min="0"
        />

        <Input
          type="number"
          placeholder="Current Occupancy"
          value={formData.currentOccupancy}
          onChange={(e) => setFormData({ ...formData, currentOccupancy: parseInt(e.target.value) })}
          required
          min="0"
        />

        <Select 
          value={formData.status} 
          onValueChange={(value: LocationStatus) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="full">Full</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
          required
          step="any"
        />

        <Input
          type="number"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
          required
          step="any"
        />
      </div>

      <Button type="submit" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        {initialData ? 'Update Location' : 'Add Location'}
      </Button>
    </form>
  );
};

export default LocationForm;