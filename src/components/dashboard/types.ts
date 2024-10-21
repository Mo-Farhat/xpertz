import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface WidgetData {
  id: string;
  title: string;
  value: string | number;
  icon: LucideIcon;

}

export interface SalesData {
  date: string;
  amount: number;
}

export interface ProductData {
  name: string;
  sales: number;
}

export interface InventoryData {
  category: string;
  count: number;
}

export interface AvailableWidget {
  id: string;
  title: string;
  description: string;
}