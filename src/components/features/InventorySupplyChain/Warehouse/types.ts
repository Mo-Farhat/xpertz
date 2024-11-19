export type LocationType = 'shelf' | 'bin' | 'pallet' | 'other';
export type LocationStatus = 'active' | 'maintenance' | 'full' | 'inactive';

export interface WarehouseLocation {
  id: string;
  name: string;
  type: LocationType;
  capacity: number;
  currentOccupancy: number;
  status: LocationStatus;
  zone?: string;
  latitude: number;
  longitude: number;
}

export interface LocationFormData extends Omit<WarehouseLocation, 'id'> {
  id?: string;
}

export interface MovementFormData {
  itemId: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  date: Date;
  reason: string;
  type: MovementType;
  performedBy: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export type MovementType = 'transfer' | 'restock' | 'pickup' | 'return';