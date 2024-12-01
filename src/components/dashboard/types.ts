import { LucideIcon } from 'lucide-react';

export interface WidgetData {
  id: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  subTitle: string;
  subValue: string | number;
  accumulated: string | number;
  yearToDate: string | number;
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