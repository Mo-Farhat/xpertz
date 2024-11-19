import React from 'react';
import Map from '../../../../components/ui/maps';
import { WarehouseLocation } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../../../components/ui/hover-card';
import { Progress } from '../../../../components/ui/progress';
import { Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface WarehouseLocationsMapProps {
  locations: WarehouseLocation[];
}
  
  const WarehouseLocationsMap: React.FC<WarehouseLocationsMapProps> = ({ locations }) => {
    const center = React.useMemo(() => {
      if (locations.length === 0) {
        return [7.873054, 80.771797] as [number, number]; // Default to NYC
      }
      
      const totalLat = locations.reduce((sum, loc) => sum + loc.latitude, 0);
      const totalLng = locations.reduce((sum, loc) => sum + loc.longitude, 0);
      
      return [
        totalLat / locations.length,
        totalLng / locations.length
      ] as [number, number];
    }, [locations]);
  
    // Convert locations to markers with hover analytics
    const warehouseStats = React.useMemo(() => {
        const totalCapacity = locations.reduce((sum, loc) => sum + loc.capacity, 0);
        const totalOccupancy = locations.reduce((sum, loc) => sum + loc.currentOccupancy, 0);
        const activeLocations = locations.filter(loc => loc.status === 'active').length;
        const maintenanceLocations = locations.filter(loc => loc.status === 'maintenance').length;
        
        return {
          totalCapacity,
          totalOccupancy,
          utilizationRate: (totalOccupancy / totalCapacity) * 100,
          activeLocations,
          maintenanceLocations
        };
      }, [locations]);
    
      const markers = React.useMemo(() => {
        return locations.map(location => ({
          position: [location.latitude, location.longitude] as [number, number],
          title: location.name,
          content: (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="cursor-pointer p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{location.name}</span>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">{location.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${location.status === 'active' ? 'bg-green-100 text-green-800' :
                        location.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        location.status === 'full' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {location.status}
                    </span>
                  </div>
    
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacity Usage</span>
                      <span className="font-medium">
                        {Math.round((location.currentOccupancy / location.capacity) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(location.currentOccupancy / location.capacity) * 100} 
                      className="h-2"
                    />
                  </div>
    
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Current Items</p>
                      <p className="text-sm font-medium">{location.currentOccupancy}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Total Capacity</p>
                      <p className="text-sm font-medium">{location.capacity}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Zone</p>
                      <p className="text-sm font-medium">{location.zone || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="text-sm font-medium capitalize">{location.type}</p>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          )
        }));
      }, [locations]);
    
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Capacity</p>
                    <p className="text-2xl font-bold">{warehouseStats.totalCapacity}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
    
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Locations</p>
                    <p className="text-2xl font-bold">{warehouseStats.activeLocations}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
    
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Maintenance</p>
                    <p className="text-2xl font-bold">{warehouseStats.maintenanceLocations}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
    
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Utilization Rate</p>
                    <p className="text-2xl font-bold">
                      {warehouseStats.utilizationRate.toFixed(1)}%
                    </p>
                  </div>
                  <AlertTriangle className={`h-8 w-8 ${
                    warehouseStats.utilizationRate > 90 ? 'text-red-500' :
                    warehouseStats.utilizationRate > 75 ? 'text-yellow-500' :
                    'text-green-500'
                  }`} />
                </div>
              </CardContent>
            </Card>
          </div>
    
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Locations Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] w-full rounded-xl overflow-hidden border border-gray-200">
                <Map 
                  center={center}
                  markers={markers}
                  zoom={12}
                  className="h-full w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    };
    
    export default WarehouseLocationsMap;