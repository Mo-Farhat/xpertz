import React from 'react';
import { Checkbox } from "../ui/checkbox";
import { AvailableWidget } from './types';

interface CustomizeWidgetsProps {
  availableWidgets: AvailableWidget[];
  selectedWidgets: string[];
  onWidgetToggle: (widgetId: string) => void;
}

const CustomizeWidgets: React.FC<CustomizeWidgetsProps> = ({
  availableWidgets,
  selectedWidgets,
  onWidgetToggle
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {availableWidgets.map(widget => (
        <div key={widget.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">{widget.title}</h3>
            <Checkbox
              checked={selectedWidgets.includes(widget.id)}
              onCheckedChange={() => onWidgetToggle(widget.id)}
            />
          </div>
          <p className="text-gray-600">{widget.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomizeWidgets;