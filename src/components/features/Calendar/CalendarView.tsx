import React from 'react';
import { useEvents } from './EventContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, subDays, isSameMonth, isSameDay } from 'date-fns';
import { Button } from "../../../components/ui/button";
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "../../../components/ui/dialog";
import EventForm from './EventForm';
import { DayCell } from './DayCell';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarView: React.FC = () => {
  const { selectedDate, setSelectedDate } = useEvents();

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const startDate = subDays(monthStart, monthStart.getDay());
  const endDate = addDays(monthEnd, 6 - monthEnd.getDay());

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">{format(selectedDate, 'MMMM yyyy')}</h2>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              ←
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              →
            </Button>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-violet-500 hover:bg-violet-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <EventForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="grid grid-cols-7 border-b">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className="focus:outline-none"
            >
              <DayCell
                date={day}
                isSelected={isSameDay(day, selectedDate)}
                isOutsideMonth={!isSameMonth(day, selectedDate)}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};