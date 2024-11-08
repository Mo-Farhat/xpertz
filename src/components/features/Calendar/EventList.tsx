import React from 'react';
import { useEvents } from './EventContext';
import { format } from 'date-fns';
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Badge } from "../../ui/badge";
import { Trash2 } from 'lucide-react';

export const EventList: React.FC = () => {
  const { events, deleteEvent } = useEvents();

  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
      case 'personal':
        return 'bg-green-100 text-green-800';
      case 'task':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>
                <div>{format(event.start, 'MMM d, yyyy')}</div>
                <div className="text-sm text-muted-foreground">
                  {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getCategoryColor(event.category)}>
                  {event.category}
                </Badge>
              </TableCell>
              <TableCell>{event.location || '-'}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteEvent(event.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};