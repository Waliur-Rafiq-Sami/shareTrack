"use client";

import { useState } from "react";
import { Edit2, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "@/lib/toast-service";

interface TradeActionsProps {
  trade: any;
  onEdit: (trade: any) => void;
  onDelete: (id: string) => Promise<void>;
}

export function TradeActions({ trade, onEdit, onDelete }: TradeActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await onDelete(trade._id);

      toast.success({
        title: "Trade Deleted",
        description: `${trade.instrument} has been removed successfully.`,
      });

      setShowDeleteDialog(false);
    } catch (error) {
      toast.error({
        title: "Delete Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* DROPDOWN ACTIONS */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48 bg-background border shadow-md">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/20" />

          <DropdownMenuItem onClick={() => onEdit(trade)} className="cursor-pointer">
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Trade
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-red-600 focus:text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Trade
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* DELETE DIALOG */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:max-w-[420px] border border-border/80 shadow-2xl rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-rose-500" />
              Delete Trade Record
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
              You are about to permanently delete <span className="font-semibold text-foreground">{trade.instrument}</span>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-3 p-3 rounded-lg border bg-muted/40">
            <p className="text-sm font-semibold">{trade.instrument}</p>
            <p className="text-xs text-muted-foreground">ID: {trade._id}</p>
          </div>

          <AlertDialogFooter className="mt-4 sm:mt-6">
            <AlertDialogCancel disabled={isDeleting} className="font-medium tracking-wide">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="
                bg-rose-600 hover:bg-rose-700
                text-white font-semibold tracking-wide
                shadow-md transition-all active:scale-[0.98]
                border-none flex items-center gap-2
              ">
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Record"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
