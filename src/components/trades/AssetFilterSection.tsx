import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

export const AssetFilterSection = ({ searchInstrument, setSearchInstrument, searchAction, setSearchAction, onUpdate }: any) => (
  <div className="lg:col-span-4 space-y-2">
    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Asset Parameters</label>
    <div className="grid grid-cols-2 gap-2">
      <div className="relative w-full">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/80" />
        <Input
          placeholder="Ticker code..."
          value={searchInstrument}
          onChange={(e) => onUpdate(() => setSearchInstrument(e.target.value))}
          className="pl-9 h-11 bg-background border-input w-full text-sm font-medium uppercase placeholder:normal-case focus-visible:ring-1"
        />
      </div>
      <div className="relative w-full">
        <SlidersHorizontal className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/80 pointer-events-none z-20" />
        <select
          value={searchAction}
          onChange={(e) => onUpdate(() => setSearchAction(e.target.value))}
          className="pl-9 pr-10 h-11 bg-background text-foreground border border-input rounded-md w-full text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none cursor-pointer relative z-10 shadow-sm">
          <option value="ALL">All Actions</option>
          <option value="BUY" className="text-rose-500 font-semibold">
            BUY
          </option>
          <option value="SELL" className="text-emerald-500 font-semibold">
            SELL
          </option>
        </select>
        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-muted-foreground/80 pointer-events-none z-20" />
      </div>
    </div>
  </div>
);
