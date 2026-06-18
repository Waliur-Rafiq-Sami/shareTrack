"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShareCalcZodSchema, TShareCalcInput } from "@/schemas/shareCalcSchema";
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem: any | null; // Holds stock data if editing, null if adding new
}

export function CalculationForm({ isOpen, onClose, targetItem }: FormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 1. Initialize react-hook-form bound to the enterprise Zod schema
  const form = useForm<TShareCalcInput>({
    resolver: zodResolver(ShareCalcZodSchema),
    defaultValues: {
      instrument: "",
      quantity: 0,
      buyPrice: 0,
      sellPrice: 0,
    },
  });

  // 2. Watch for changes to sync existing item state into fields when editing
  useEffect(() => {
    if (targetItem) {
      form.reset({
        instrument: targetItem.instrument,
        quantity: targetItem.quantity,
        buyPrice: targetItem.buyPrice,
        sellPrice: targetItem.sellPrice,
      });
    } else {
      form.reset({
        instrument: "",
        quantity: 0,
        buyPrice: 0,
        sellPrice: 0,
      });
    }
  }, [targetItem, isOpen, form]);

  // 3. TanStack Mutation for Saving or Updating the entry
  const saveMutation = useMutation({
    mutationFn: async (values: TShareCalcInput) => {
      const url = targetItem ? `/api/shares/${targetItem._id}` : "/api/shares";
      const method = targetItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok)
        throw new Error("Network failure processing save request.");
      return response.json();
    },
    onSuccess: () => {
      // Refresh the data list cache instantly
      queryClient.invalidateQueries({ queryKey: ["shareCalculations"] });
      toast({
        title: targetItem ? "Calculation Updated" : "Calculation Saved",
        description:
          "Your stock profit analysis metrics are re-calculated successfully.",
      });
      onClose();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Could not sync data metrics with database safely.",
      });
    },
  });

  const handleFormSubmit = (values: TShareCalcInput) => {
    saveMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* max-w-[95vw] ensures high fidelity rendering on tightly packed mobile views */}
      <DialogContent className="max-w-[95vw] sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle>
            {targetItem
              ? `Edit Matrix: ${targetItem.instrument}`
              : "Add New Calculation"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 pt-2"
          >
            {/* Stock Name Field */}
            <FormField
              control={form.control}
              name="instrument"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Name / Ticker</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., AAPL, GP, BATBC"
                      {...field}
                      className="uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Shares Quantity Field */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (Shares)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buying Price Field */}
            <FormField
              control={form.control}
              name="buyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Buying Price (৳)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current/Selling Price Field */}
            <FormField
              control={form.control}
              name="sellPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current / Market Price (৳)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons Container */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saveMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {targetItem ? "Save Changes" : "Calculate & Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
