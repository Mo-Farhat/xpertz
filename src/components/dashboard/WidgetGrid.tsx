import React from 'react';
import { WidgetData } from './types';
import { LucideIcon } from 'lucide-react';

interface WidgetGridProps {
  widgets: WidgetData[];
}

const WidgetGrid: React.FC<WidgetGridProps> = ({ widgets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {widgets.map(widget => (
        <div key={widget.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              {React.createElement(widget.icon as LucideIcon)}
            </div>
            <h3 className="text-lg font-semibold text-gray-700">{widget.title}</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{widget.value}</p>
        </div>
      ))}
    </div>
  );
};

export default WidgetGrid;