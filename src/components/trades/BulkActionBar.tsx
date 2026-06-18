"use client";

import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

interface BulkActionsProps {
  count: number;
  onDelete: () => void;
  onCancel: () => void;
}

export function BulkActionBar({ count, onDelete, onCancel }: BulkActionsProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-background border shadow-lg rounded-lg p-3 animate-in fade-in slide-in-from-bottom-4">
      <span className="text-sm font-medium text-muted-foreground">{count} record(s) selected</span>
      <Button variant="destructive" size="sm" onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Selected
      </Button>
      <Button variant="ghost" size="sm" onClick={onCancel}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
