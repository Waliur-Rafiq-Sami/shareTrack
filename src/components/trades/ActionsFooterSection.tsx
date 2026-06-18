import { ChevronDown, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { ExportButton } from "./ExportButton"; // Ensure this component exists

export const ActionsFooterSection = ({
  sortBy,
  sortOrder,
  onSortChange,
  onSearch,
  onClear,
  onOpenCreate,
  hasActiveFilters,
  isInvalid,
  appliedFilters,
  onUpdate,
}: any) => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-border/50 pt-5 mt-2 items-end">
    <div className="md:col-span-8 grid grid-cols-2 gap-4">
      {["rate", "commission"].map((field) => (
        <div key={field} className="relative">
          <label className="text-[10px] font-bold uppercase text-muted-foreground/70 mb-1 block">Sort {field}</label>
          <select
            value={sortBy === field ? sortOrder || "" : ""}
            onChange={(e) => onUpdate(() => onSortChange(field, e.target.value || null))}
            className="pl-3 pr-8 h-11 bg-background border border-input rounded-md w-full text-sm font-medium appearance-none cursor-pointer focus-visible:ring-1">
            <option value="">Default</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <ChevronDown className="absolute right-3 top-9 h-4 w-4 text-muted-foreground/80 pointer-events-none" />
        </div>
      ))}
    </div>
    <div className="md:col-span-4 flex flex-col gap-2">
      <Button onClick={onSearch} disabled={isInvalid} className="w-full bg-blue-600 hover:bg-blue-700">
        Search Records
      </Button>
      <div className="flex gap-2">
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClear} className="flex-1">
            <X className="h-4 w-4 mr-2" /> Clear
          </Button>
        )}
        {/* <ExportButton filters={appliedFilters} /> */}
        ex
        <Button onClick={onOpenCreate} className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
    </div>
  </div>
);
