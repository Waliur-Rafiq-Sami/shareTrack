"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalculationList } from "./calculation-list";
import { CalculationForm } from "./calculation-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Calculator } from "lucide-react";

export function CalculatorDashboard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // TanStack Query: Syncing data cache
  const { data: calculations = [], isLoading } = useQuery({
    queryKey: ["shareCalculations"],
    queryFn: async () => {
      const res = await fetch("/api/shares");
      return res.json();
    },
  });

  // Delete Mutation Hook
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/shares/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shareCalculations"] });
      // Distinct, positive Shadcn feedback alert
      // toast({
      //   title: "Record Deleted Successfully",
      //   description:
      //     "The requested stock calculation has been cleared from your storage.",
      //   className: "bg-emerald-600 text-white border-none",
      // });
    },
  });

  if (isLoading) return <div className="text-center py-20 text-sm">Crunching data formulas...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-xl border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Share Profit Calculator</h1>
            <p className="text-xs text-muted-foreground">Quick entry calculation modeling toolkit.</p>
          </div>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            setSelectedItem(null);
            setModalOpen(true);
          }}>
          <Plus className="mr-1.5 h-4 w-4" /> New Calculation
        </Button>
      </div>

      <CalculationList
        items={calculations}
        onEdit={(item) => {
          setSelectedItem(item);
          setModalOpen(true);
        }}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <CalculationForm isOpen={modalOpen} onClose={() => setModalOpen(false)} targetItem={selectedItem} />
    </div>
  );
}
