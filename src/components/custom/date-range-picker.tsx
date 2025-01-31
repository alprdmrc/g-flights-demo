"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  selectedDate?: DateRange;
  onDatesChange: (dates: DateRange) => void;
}

export function DatePickerWithRange({
  className,
  selectedDate,
  onDatesChange,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2 w-full h-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full h-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {selectedDate?.from ? (
              selectedDate.to ? (
                <div className="grid grid-cols-2 w-full">
                  <span className="pl-2">
                    {format(selectedDate.from, "E, LLL d")}
                  </span>
                  <span className="pl-2 border-l-2">
                    {format(selectedDate.to, "E, LLL d")}
                  </span>
                </div>
              ) : (
                format(selectedDate.from, "E, LLL d")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedDate?.from}
            selected={selectedDate}
            onSelect={(dates) => dates && onDatesChange(dates)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
