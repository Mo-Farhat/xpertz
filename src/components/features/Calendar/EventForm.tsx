import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useEvents } from './EventContext';
import { format } from 'date-fns';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogTitle } from "../../../components/ui/dialog";

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start: z.string(),
  end: z.string(),
  category: z.enum(["meeting", "personal", "task", "other"]),
  location: z.string().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

const EventForm: React.FC = () => {
  const { addEvent, selectedDate } = useEvents();
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      start: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
      end: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
      category: 'meeting',
      location: '',
    },
  });

  const onSubmit = (data: EventFormData) => {
    addEvent({
      title: data.title,
      description: data.description || '',
      start: new Date(data.start),
      end: new Date(data.end),
      category: data.category,
      location: data.location || '',
    });
    form.reset();
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Add New Event</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input {...field} className="border-blue-200 focus:border-blue-500" placeholder="Enter event title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} className="border-blue-200 focus:border-blue-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} className="border-blue-200 focus:border-blue-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (optional)</FormLabel>
                <FormControl>
                  <Input {...field} className="border-blue-200 focus:border-blue-500" placeholder="Enter event location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Textarea {...field} className="border-blue-200 focus:border-blue-500 min-h-[100px]" placeholder="Enter event description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Event
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventForm;