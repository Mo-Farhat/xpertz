import React, { createContext, useContext, useState } from 'react';
import { CalendarEvent, EventContextType } from './types';

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updatedEvent: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  return (
    <EventContext.Provider value={{
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      selectedDate,
      setSelectedDate,
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};