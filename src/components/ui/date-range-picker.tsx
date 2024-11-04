import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Badge } from "./badge";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal bg-white hover:bg-gray-50/50 transition-all",
              "border-gray-200 hover:border-gray-300",
              "shadow-sm hover:shadow",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary/70" />
            {value?.from ? (
              value.to ? (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-md font-normal">
                    {format(value.from, "MMM dd, yyyy")}
                  </Badge>
                  <span className="text-muted-foreground">to</span>
                  <Badge variant="secondary" className="rounded-md font-normal">
                    {format(value.to, "MMM dd, yyyy")}
                  </Badge>
                </div>
              ) : (
                <Badge variant="secondary" className="rounded-md font-normal">
                  {format(value.from, "MMM dd, yyyy")}
                </Badge>
              )
            ) : (
              <span className="text-muted-foreground">Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-white shadow-lg rounded-lg border-gray-200" 
          align="start"
        >
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-medium text-sm text-gray-700">Select Range</h3>
          </div>
          <Calendar
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            className="p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}