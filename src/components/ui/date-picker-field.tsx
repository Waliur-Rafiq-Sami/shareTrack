"use client";

import React, { useMemo } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerFieldProps {
  value: string; // Expects raw "DD/MM/YYYY" format
  onChange: (value: string) => void;
  placeholder?: string;
  isInvalid?: boolean;
  align?: "start" | "center" | "end";
}

export const DatePickerField = ({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  isInvalid = false,
  align = "start",
}: DatePickerFieldProps) => {
  // Memoize date parsing to maintain high rendering performance
  const parsedDate = useMemo(() => {
    if (!value) return undefined;
    const parsed = parse(value, "dd/MM/yyyy", new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "dd/MM/yyyy"));
    } else {
      onChange("");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-11 pl-3 text-left font-normal justify-start items-center bg-background border-input gap-2 transition-all duration-200",
            isInvalid
              ? "border-red-500 text-red-600 dark:text-red-400 hover:text-red-600 focus:ring-2 focus:ring-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)] bg-red-50/10"
              : "text-muted-foreground",
          )}
        >
          <CalendarIcon
            className={cn(
              "h-4 w-4 shrink-0",
              isInvalid ? "text-red-500" : "text-muted-foreground/70",
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              value && "text-foreground font-semibold",
            )}
          >
            {value ? value : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar mode="single" selected={parsedDate} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
};
