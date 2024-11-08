import React from 'react';
import { CalendarView } from './CalendarView';
import { EventForm } from './EventForm';
import { EventList } from './EventList';
import { EventProvider } from './EventContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

const Calendar: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Calendar</h2>
      <EventProvider>
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="events">Events List</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="space-y-4">
            <EventForm />
            <CalendarView />
          </TabsContent>
          <TabsContent value="events">
            <EventList />
          </TabsContent>
        </Tabs>
      </EventProvider>
    </div>
  );
};

export default Calendar;