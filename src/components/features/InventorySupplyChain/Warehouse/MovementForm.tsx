import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { MovementFormData, MovementType, WarehouseLocation } from './types';
import { useToast } from "../../../hooks/use-toast";
import { useAuth } from '../../../../contexts/AuthContext';

interface MovementFormProps {
  onSubmit: (movement: MovementFormData) => Promise<void>;
  locations: WarehouseLocation[];
  initialData?: MovementFormData;
}

const MovementForm: React.FC<MovementFormProps> = ({ onSubmit, locations, initialData }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = React.useState<MovementFormData>(initialData || {
    itemId: '',
    fromLocation: '',
    toLocation: '',
    quantity: 0,
    date: new Date(),
    reason: '',
    type: 'transfer',
    performedBy: user?.uid || '',
    status: 'pending'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fromLocation = locations.find(loc => loc.id === formData.fromLocation);
    const toLocation = locations.find(loc => loc.id === formData.toLocation);

    // Validation checks
    if (fromLocation && formData.quantity > fromLocation.currentOccupancy) {
      toast({
        title: "Validation Error",
        description: "Quantity exceeds available items in source location",
        variant: "destructive",
      });
      return;
    }

    if (toLocation && (toLocation.currentOccupancy + formData.quantity) > toLocation.capacity) {
      toast({
        title: "Validation Error",
        description: "Destination location doesn't have enough capacity",
        variant: "destructive",
      });
      return;
    }

    if (formData.fromLocation === formData.toLocation) {
      toast({
        title: "Validation Error",
        description: "Source and destination locations cannot be the same",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
      if (!initialData) {
        setFormData({
          itemId: '',
          fromLocation: '',
          toLocation: '',
          quantity: 0,
          date: new Date(),
          reason: '',
          type: 'transfer',
          performedBy: user?.uid || '',
          status: 'pending'
        });
      }
      toast({
        title: "Success",
        description: initialData ? "Movement updated successfully" : "Movement added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save movement",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Input
          type="text"
          placeholder="Item ID"
          value={formData.itemId}
          onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
          required
        />

        <Select 
          value={formData.fromLocation} 
          onValueChange={(value) => setFormData({ ...formData, fromLocation: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="From Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map(location => (
              <SelectItem key={location.id} value={location.id}>
                {location.name} ({location.currentOccupancy}/{location.capacity})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={formData.toLocation} 
          onValueChange={(value) => setFormData({ ...formData, toLocation: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="To Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map(location => (
              <SelectItem key={location.id} value={location.id}>
                {location.name} ({location.currentOccupancy}/{location.capacity})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
          required
          min="1"
        />

        <Input
          type="datetime-local"
          value={formData.date.toISOString().slice(0, 16)}
          onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
          required
        />

        <Select 
          value={formData.type} 
          onValueChange={(value: MovementType) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Movement Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transfer">Transfer</SelectItem>
            <SelectItem value="restock">Restock</SelectItem>
            <SelectItem value="pickup">Pickup</SelectItem>
            <SelectItem value="return">Return</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="Reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          required
          className="col-span-2"
        />
      </div>

      <Button type="submit" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        {initialData ? 'Update Movement' : 'Add Movement'}
      </Button>
    </form>
  );
};

export default MovementForm;