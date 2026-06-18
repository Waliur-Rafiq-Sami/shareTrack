import { DollarSign, ArrowRight, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const AmountFilterSection = ({ minAmount, setMinAmount, maxAmount, setMaxAmount, isInvalid, onUpdate }: any) => (
  <div className="lg:col-span-4 space-y-2">
    <div className="flex justify-between items-center h-4">
      <label className={cn("text-xs font-bold uppercase tracking-wider transition-colors", isInvalid ? "text-red-500" : "text-muted-foreground")}>
        Capital Outlay
      </label>
      {isInvalid && (
        <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> Invalid range
        </span>
      )}
    </div>
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <DollarSign className={cn("absolute left-3 top-3 h-4 w-4", isInvalid ? "text-red-500" : "text-muted-foreground/70")} />
        <Input
          type="number"
          step="0.01"
          placeholder="Min"
          value={minAmount === "0" ? "" : minAmount}
          onChange={(e) => onUpdate(() => setMinAmount(e.target.value))}
          className={cn("pl-8 h-11", isInvalid && "border-red-500 bg-red-50/10")}
        />
      </div>
      <ArrowRight className={cn("h-4 w-4 shrink-0", isInvalid ? "text-red-500 rotate-180" : "text-muted-foreground/50")} />
      <div className="relative flex-1">
        <DollarSign className={cn("absolute left-3 top-3 h-4 w-4", isInvalid ? "text-red-500" : "text-muted-foreground/70")} />
        <Input
          type="number"
          step="0.01"
          placeholder="Max"
          value={maxAmount === "0" ? "" : maxAmount}
          onChange={(e) => onUpdate(() => setMaxAmount(e.target.value))}
          className={cn("pl-8 h-11", isInvalid && "border-red-500 bg-red-50/10")}
        />
      </div>
    </div>
  </div>
);
