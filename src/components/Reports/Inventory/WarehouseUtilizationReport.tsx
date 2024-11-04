import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTenant } from '../../../contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { Download } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { Progress } from '../../ui/progress';

interface WarehouseSection {
  id: string;
  name: string;
  totalCapacity: number;
  usedSpace: number;
  itemCount: number;
  lastUpdated: Date;
  type: 'raw' | 'finished' | 'packaging' | 'transit';
}

const WarehouseUtilizationReport = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [sections, setSections] = useState<WarehouseSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouseData = async () => {
      if (!tenant) return;
      
      try {
        setLoading(true);
        const warehouseRef = collection(db, 'warehouseSections');
        const snapshot = await getDocs(query(warehouseRef));
        
        const sectionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastUpdated: doc.data().lastUpdated.toDate()
        })) as WarehouseSection[];

        setSections(sectionsData);
      } catch (error) {
        console.error('Error fetching warehouse data:', error);
        toast({
          title: "Error",
          description: "Failed to load warehouse utilization data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouseData();
  }, [tenant, toast]);

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  const calculateTotalUtilization = () => {
    const total = sections.reduce((acc, section) => acc + section.totalCapacity, 0);
    const used = sections.reduce((acc, section) => acc + section.usedSpace, 0);
    return (used / total) * 100;
  };

  const handleExport = () => {
    const csvContent = [
      ['Section Name', 'Type', 'Total Capacity', 'Used Space', 'Utilization %', 'Item Count', 'Last Updated'],
      ...sections.map(section => [
        section.name,
        section.type,
        section.totalCapacity.toString(),
        section.usedSpace.toString(),
        ((section.usedSpace / section.totalCapacity) * 100).toFixed(2),
        section.itemCount.toString(),
        section.lastUpdated.toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'warehouse_utilization_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Warehouse Utilization Report</CardTitle>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Overall Utilization</p>
              <div className="flex items-center gap-4">
                <Progress value={calculateTotalUtilization()} className="w-64" />
                <span className={getUtilizationColor(calculateTotalUtilization())}>
                  {calculateTotalUtilization().toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Total Capacity (m³)</TableHead>
                <TableHead className="text-right">Used Space (m³)</TableHead>
                <TableHead className="text-right">Utilization</TableHead>
                <TableHead className="text-right">Item Count</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => {
                const utilization = (section.usedSpace / section.totalCapacity) * 100;
                return (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">{section.name}</TableCell>
                    <TableCell className="capitalize">{section.type}</TableCell>
                    <TableCell className="text-right">{section.totalCapacity}</TableCell>
                    <TableCell className="text-right">{section.usedSpace}</TableCell>
                    <TableCell className={`text-right ${getUtilizationColor(utilization)}`}>
                      {utilization.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">{section.itemCount}</TableCell>
                    <TableCell>{section.lastUpdated.toLocaleDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WarehouseUtilizationReport;