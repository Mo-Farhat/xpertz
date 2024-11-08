import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import AssetReports from './AssetManagement/AssetReports';
import { Asset } from './AssetManagement/types';
import AssetForm from './AssetManagement/AssetForm';
import AssetsTable from './AssetManagement/AssetsTable';

const AssetManagement: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [activeTab, setActiveTab] = useState('management');
  const [newAsset, setNewAsset] = useState<Omit<Asset, 'id'>>({
    name: '',
    purchaseDate: new Date(),
    purchasePrice: 0,
    currentValue: 0,
    category: '',
    depreciationMethod: 'straight-line',
    usefulLife: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'assets'), orderBy('purchaseDate', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const assetData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        purchaseDate: doc.data().purchaseDate.toDate(),
      } as Asset));
      setAssets(assetData);
    });
    return unsubscribe;
  }, []);

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'assets'), {
        ...newAsset,
        purchaseDate: new Date(newAsset.purchaseDate),
      });
      setNewAsset({
        name: '',
        purchaseDate: new Date(),
        purchasePrice: 0,
        currentValue: 0,
        category: '',
        depreciationMethod: 'straight-line',
        usefulLife: 0,
      });
    } catch (error) {
      console.error("Error adding asset: ", error);
    }
  };

  const handleUpdateAsset = async (id: string, updatedAsset: Partial<Asset>) => {
    try {
      await updateDoc(doc(db, 'assets', id), updatedAsset);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating asset: ", error);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'assets', id));
    } catch (error) {
      console.error("Error deleting asset: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = assets.map(asset => 
      `${asset.name},${asset.purchaseDate.toISOString()},${asset.purchasePrice},${asset.currentValue},${asset.category},${asset.depreciationMethod},${asset.usefulLife}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'assets.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="management">Asset Management</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="management">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Asset Management</h2>
            <AssetForm 
              newAsset={newAsset}
              setNewAsset={setNewAsset}
              onSubmit={handleAddAsset}
            />
            <button
              onClick={handleExport}
              className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
            >
              <Download size={18} className="mr-2" />
              Export CSV
            </button>
            <AssetsTable 
              assets={assets}
              onEdit={setEditingId}
              onDelete={handleDeleteAsset}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <AssetReports assets={assets} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetManagement;