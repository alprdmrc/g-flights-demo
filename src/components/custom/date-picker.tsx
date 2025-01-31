import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  minDate?: Date | null;
}

export function DatePicker({
  selectedDate,
  onDateChange,
  minDate,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {selectedDate ? (
            format(selectedDate, "E, LLL d")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={(day) => {
            if (day) {
              onDateChange(day);
            }
          }}
          initialFocus
          fromDate={minDate || undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
