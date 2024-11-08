export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    category?: 'meeting' | 'personal' | 'task' | 'other';
    location?: string;
    attendees?: string[];
  }
  
  export interface EventContextType {
    events: CalendarEvent[];
    addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
    updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
    deleteEvent: (id: string) => void;
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
  }