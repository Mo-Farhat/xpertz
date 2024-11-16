import React from 'react';
import { useEvents } from './EventContext';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';
import { Banknote } from 'lucide-react';

interface DayCellProps {
  date: Date;
  isSelected?: boolean;
  isOutsideMonth?: boolean;
}

export const DayCell: React.FC<DayCellProps> = ({ date, isSelected, isOutsideMonth }) => {
  const { events } = useEvents();
  const dayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const chequeReminders = dayEvents.filter(event => event.type === 'payment');

  return (
    <div className={cn(
      "h-24 border border-gray-200 p-1",
      isOutsideMonth && "bg-gray-50",
      isSelected && "bg-violet-50 border-violet-200"
    )}>
      <div className="flex justify-between items-center">
        <span className={cn(
          "text-sm font-medium",
          isOutsideMonth && "text-gray-400",
          isSelected && "text-violet-600"
        )}>
          {format(date, 'd')}
        </span>
        {dayEvents.length > 0 && (
          <span className="text-xs bg-violet-100 text-violet-600 px-1.5 rounded-full">
            {dayEvents.length}
          </span>
        )}
      </div>
      <div className="mt-1 space-y-1">
        {dayEvents.slice(0, 2).map((event) => (
          <div
            key={event.id}
            className={cn(
              "text-xs truncate p-1 rounded flex items-center gap-1",
              event.type === 'payment' ? "bg-green-100 text-green-700" : "bg-violet-100 text-violet-700"
            )}
          >
            {event.type === 'payment' && <Banknote className="h-3 w-3" />}
            {event.title}
          </div>
        ))}
        {dayEvents.length > 2 && (
          <div className="text-xs text-gray-500">
            +{dayEvents.length - 2} more {chequeReminders.length > 0 && <Banknote className="h-3 w-3 inline ml-1" />}
          </div>
        )}
      </div>
    </div>
  );
};