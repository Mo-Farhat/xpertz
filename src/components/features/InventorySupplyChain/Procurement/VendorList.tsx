import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Edit, Trash2, Star, Download } from 'lucide-react';
import { useToast } from "../../../hooks/use-toast";
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Vendor } from './types';
import { deleteVendor } from './vendorService';

const VendorList: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'vendors'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vendorsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Vendor));
      setVendors(vendorsData);
    }, (error) => {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vendors",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      await deleteVendor(id);
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csvContent = vendors.map(vendor => 
      `${vendor.name},${vendor.contactPerson},${vendor.email},${vendor.phone},${vendor.address},${vendor.rating}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'vendors.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vendors List</CardTitle>
        <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.contactPerson}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${
                            index < vendor.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      onClick={() => console.log('Edit vendor:', vendor.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(vendor.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorList;