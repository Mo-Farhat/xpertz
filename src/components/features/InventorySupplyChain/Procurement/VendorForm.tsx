import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Plus } from 'lucide-react';
import { useToast } from "../../../hooks/use-toast";
import { addVendor } from './vendorService';
import { VendorFormData } from './types';

const VendorForm: React.FC = () => {
  const { toast } = useToast();
  const [newVendor, setNewVendor] = useState<VendorFormData>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    rating: 0,
    status: 'active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVendor(newVendor);
      setNewVendor({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        rating: 0,
        status: 'active',
      });
      toast({
        title: "Success",
        description: "Vendor added successfully",
      });
    } catch (error) {
      console.error("Error adding vendor:", error);
      toast({
        title: "Error",
        description: "Failed to add vendor",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Vendor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Vendor Name"
              value={newVendor.name}
              onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
              required
            />
            <Input
              placeholder="Contact Person"
              value={newVendor.contactPerson}
              onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={newVendor.email}
              onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
              required
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={newVendor.phone}
              onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
              required
            />
            <Input
              placeholder="Address"
              value={newVendor.address}
              onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Rating (1-5)"
              value={newVendor.rating}
              onChange={(e) => setNewVendor({ ...newVendor, rating: parseInt(e.target.value) })}
              min="1"
              max="5"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Vendor
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VendorForm;