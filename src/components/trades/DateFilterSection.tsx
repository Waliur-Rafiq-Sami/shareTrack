import { AlertCircle, ArrowRight } from "lucide-react";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { cn } from "@/lib/utils";

export const DateFilterSection = ({ startDate, setStartDate, endDate, setEndDate, isInvalid, onUpdate }: any) => (
  <div className="lg:col-span-4 space-y-2">
    <div className="flex justify-between items-center h-4">
      <label className={cn("text-xs font-bold uppercase tracking-wider transition-colors", isInvalid ? "text-red-500" : "text-muted-foreground")}>
        Timeline Interval
      </label>
      {isInvalid && (
        <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> Invalid range
        </span>
      )}
    </div>
    <div className="flex items-center gap-2 w-full">
      <DatePickerField value={startDate} onChange={(val) => onUpdate(() => setStartDate(val))} isInvalid={isInvalid} align="start" />
      <ArrowRight className={cn("h-4 w-4 shrink-0", isInvalid ? "text-red-500 rotate-180" : "text-muted-foreground/50")} />
      <DatePickerField value={endDate} onChange={(val) => onUpdate(() => setEndDate(val))} isInvalid={isInvalid} align="end" />
    </div>
  </div>
);
