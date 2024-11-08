import React from 'react';
import { CalendarView } from './Calendar/CalendarView';
import EventForm from './Calendar/EventForm';
import { EventList } from './Calendar/EventList';
import { EventProvider } from './Calendar/EventContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const Calendar: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Calendar & Events</CardTitle>
        </CardHeader>
        <CardContent>
          <EventProvider>
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="events">Events List</TabsTrigger>
                <TabsTrigger value="new">Add Event</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="space-y-6">
                <CalendarView />
              </TabsContent>
              
              <TabsContent value="events">
                <EventList />
              </TabsContent>
              
              <TabsContent value="new">
                <EventForm />
              </TabsContent>
            </Tabs>
          </EventProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;