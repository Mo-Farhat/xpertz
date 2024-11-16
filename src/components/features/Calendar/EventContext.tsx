import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { CalendarEvent, EventContextType } from './types';
import { useToast } from "../../hooks/use-toast";

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'events'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsData: CalendarEvent[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Convert Firestore Timestamp to Date
        const startDate = data.start instanceof Timestamp ? data.start.toDate() : new Date(data.start);
        const endDate = data.end instanceof Timestamp ? data.end.toDate() : new Date(data.end);
        
        eventsData.push({
          id: doc.id,
          ...data,
          start: startDate,
          end: endDate,
          category: data.category || 'other', // Ensure category is always defined
        } as CalendarEvent);
      });
      setEvents(eventsData);
    }, (error) => {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [toast]);

  const addEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const eventData = {
        ...event,
        start: Timestamp.fromDate(event.start),
        end: Timestamp.fromDate(event.end),
        createdAt: Timestamp.now(),
        category: event.category || 'other', // Ensure category is always defined
      };

      await addDoc(collection(db, 'events'), eventData);
      toast({
        title: "Success",
        description: "Event added successfully",
      });
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error",
        description: "Failed to add event",
        variant: "destructive",
      });
    }
  };

  const updateEvent = async (id: string, updatedEvent: Partial<CalendarEvent>) => {
    try {
      const eventRef = doc(db, 'events', id);
      const updateData: Record<string, any> = { ...updatedEvent };
      
      if (updateData.start) {
        updateData.start = Timestamp.fromDate(updatedEvent.start as Date);
      }
      if (updateData.end) {
        updateData.end = Timestamp.fromDate(updatedEvent.end as Date);
      }
      
      await updateDoc(eventRef, {
        ...updateData,
        updatedAt: Timestamp.now(),
      });
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  return (
    <EventContext.Provider value={{
      events,
      selectedDate,
      setSelectedDate,
      addEvent,
      updateEvent,
      deleteEvent,
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