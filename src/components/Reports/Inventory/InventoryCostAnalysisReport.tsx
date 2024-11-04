import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Download } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

interface CostAnalysisItem {
  id: string;
  name: string;
  quantity: number;
  costPrice: number;
  storageCost: number;
  handlingCost: number;
  insuranceCost: number;
  obsolescenceCost: number;
  totalCarryingCost: number;
  carryingCostPerUnit: number;
}

const InventoryCostAnalysisReport = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [items, setItems] = useState<CostAnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [costPeriod, setCostPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    const fetchInventoryCosts = async () => {
      if (!tenant) return;
      
      try {
        setLoading(true);
        const inventoryRef = collection(db, 'inventory');
        const querySnapshot = await getDocs(query(inventoryRef));
        
        const costData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const quantity = data.quantity || 0;
          const costPrice = data.costPrice || 0;
          const totalValue = quantity * costPrice;
          
          // Calculate various costs (these could be adjusted based on actual business rules)
          const storageCost = totalValue * 0.02; // 2% of value for storage
          const handlingCost = quantity * 0.5; // $0.50 per unit for handling
          const insuranceCost = totalValue * 0.01; // 1% of value for insurance
          const obsolescenceCost = totalValue * 0.03; // 3% of value for obsolescence risk
          
          const totalCarryingCost = storageCost + handlingCost + insuranceCost + obsolescenceCost;
          const carryingCostPerUnit = quantity > 0 ? totalCarryingCost / quantity : 0;

          return {
            id: doc.id,
            name: data.name,
            quantity,
            costPrice,
            storageCost,
            handlingCost,
            insuranceCost,
            obsolescenceCost,
            totalCarryingCost,
            carryingCostPerUnit
          };
        });

        setItems(costData);
      } catch (error) {
        console.error('Error fetching inventory cost data:', error);
        toast({
          title: "Error",
          description: "Failed to load inventory cost analysis data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryCosts();
  }, [tenant, costPeriod, toast]);

  const handleExport = () => {
    const csvContent = [
      ['Item Name', 'Quantity', 'Cost Price', 'Storage Cost', 'Handling Cost', 'Insurance Cost', 'Obsolescence Cost', 'Total Carrying Cost', 'Carrying Cost Per Unit'],
      ...items.map(item => [
        item.name,
        item.quantity,
        item.costPrice.toFixed(2),
        item.storageCost.toFixed(2),
        item.handlingCost.toFixed(2),
        item.insuranceCost.toFixed(2),
        item.obsolescenceCost.toFixed(2),
        item.totalCarryingCost.toFixed(2),
        item.carryingCostPerUnit.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_cost_analysis_${costPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCosts = items.reduce((acc, item) => acc + item.totalCarryingCost, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Inventory Cost Analysis Report</CardTitle>
            <p className="text-sm text-gray-500 mt-2">
              Analysis of inventory carrying costs including storage, handling, insurance, and obsolescence
            </p>
          </div>
          <div className="flex gap-4">
            <Select value={costPeriod} onValueChange={(value: 'month' | 'quarter' | 'year') => setCostPeriod(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly Costs</SelectItem>
                <SelectItem value="quarter">Quarterly Costs</SelectItem>
                <SelectItem value="year">Yearly Costs</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">${totalCosts.toFixed(2)}</div>
              <p className="text-sm text-gray-500">Total Carrying Costs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                ${(totalCosts / items.reduce((acc, item) => acc + item.quantity, 0) || 0).toFixed(2)}
              </div>
              <p className="text-sm text-gray-500">Average Cost Per Unit</p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Storage Cost</TableHead>
                <TableHead className="text-right">Handling Cost</TableHead>
                <TableHead className="text-right">Insurance Cost</TableHead>
                <TableHead className="text-right">Obsolescence Cost</TableHead>
                <TableHead className="text-right">Total Carrying Cost</TableHead>
                <TableHead className="text-right">Cost Per Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.storageCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.handlingCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.insuranceCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.obsolescenceCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.totalCarryingCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.carryingCostPerUnit.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryCostAnalysisReport;