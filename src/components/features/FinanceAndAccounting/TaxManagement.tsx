import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../../components/ui/button";
import { BarChart2 } from "lucide-react";
import TaxForm from './TaxManagement/TaxForm';
import TaxTable from './TaxManagement/TaxTable';
import ExportButton from './TaxManagement/ExportButton';
import TaxReports from '../../Reports/Finance/Tax/TaxReports';
import { TaxRecord } from './TaxManagement/types';

const TaxManagement: React.FC = () => {
  const { toast } = useToast();
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('records');
  const [newTaxRecord, setNewTaxRecord] = useState<Omit<TaxRecord, 'id'>>({
    taxYear: new Date().getFullYear(),
    taxType: '',
    amount: 0,
    dueDate: new Date(),
    status: 'pending',
    region: '',
  });

  useEffect(() => {
    const q = query(collection(db, 'taxRecords'), orderBy('dueDate'), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const records = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate.toDate(),
      } as TaxRecord));
      setTaxRecords(records);
    });
    return unsubscribe;
  }, []);

  const handleAddTaxRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'taxRecords'), {
        ...newTaxRecord,
        dueDate: new Date(newTaxRecord.dueDate),
      });
      setNewTaxRecord({
        taxYear: new Date().getFullYear(),
        taxType: '',
        amount: 0,
        dueDate: new Date(),
        status: 'pending',
        region: '',
      });
      toast({
        title: "Success",
        description: "Tax record added successfully",
      });
    } catch (error) {
      console.error("Error adding tax record: ", error);
      toast({
        title: "Error",
        description: "Failed to add tax record",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTaxRecord = async (id: string, updatedRecord: Partial<TaxRecord>) => {
    try {
      await updateDoc(doc(db, 'taxRecords', id), updatedRecord);
      setEditingId(null);
      toast({
        title: "Success",
        description: "Tax record updated successfully",
      });
    } catch (error) {
      console.error("Error updating tax record: ", error);
      toast({
        title: "Error",
        description: "Failed to update tax record",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTaxRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'taxRecords', id));
      toast({
        title: "Success",
        description: "Tax record deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting tax record: ", error);
      toast({
        title: "Error",
        description: "Failed to delete tax record",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tax Management</h2>
        <div className="flex gap-4">
          <ExportButton taxRecords={taxRecords} />
          <Button
            onClick={() => setActiveTab('reports')}
            className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
          >
            <BarChart2 size={18} />
            View Reports
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="records">Tax Records</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="records">
          <div className="space-y-4">            
            <TaxForm
              newTaxRecord={newTaxRecord}
              setNewTaxRecord={setNewTaxRecord}
              onSubmit={handleAddTaxRecord}
            />
            
            <TaxTable
              taxRecords={taxRecords}
              onEdit={setEditingId}
              onDelete={handleDeleteTaxRecord}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <TaxReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxManagement;