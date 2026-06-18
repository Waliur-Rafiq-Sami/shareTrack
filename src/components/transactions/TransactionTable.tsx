"use client";

import React, { useState } from "react";
import { RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { TransactionRecord } from "@/hooks/useTransactionsLedger";
import { TransactionTableHeader } from "./TransactionTableHeader";
import { TransactionTableRow } from "./TransactionTableRow";
import { Button } from "@/components/ui/button";
import { TransactionReverseModal } from "../holdings/table/modal/TransactionReverseModal";

interface TableProps {
  transactions: TransactionRecord[];
  currentSortBy: string;
  currentSortOrder: "asc" | "desc";
  onSort: (key: string) => void;
  onRefresh?: () => void;
}

export function TransactionTable({
  transactions,
  currentSortBy,
  currentSortOrder,
  onSort,
  onRefresh,
}: TableProps) {
  // Initialize React Query Client to manage global cache state
  const queryClient = useQueryClient();

  // Modal State Management
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  return (
    <div
      className="relative overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm scrollbar-thin
       
                  [&::-webkit-scrollbar]:h-2 
                  [&::-webkit-scrollbar-track]:bg-slate-100 
                  dark:[&::-webkit-scrollbar-track]:bg-slate-900/50 
                  [&::-webkit-scrollbar-thumb]:bg-slate-300 
                  dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 
                  [&::-webkit-scrollbar-thumb]:rounded-full 
                  hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 
                  dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-600"
    >
      <table className="w-full text-left border-collapse min-w-[800px]">
        <TransactionTableHeader
          currentSortBy={currentSortBy}
          currentSortOrder={currentSortOrder}
          onSort={onSort}
        />

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
          {transactions.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="p-16 text-center text-slate-400 dark:text-slate-500 font-medium"
              >
                No ledger profiles matched your dynamic search constraints.
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <TransactionTableRow
                key={tx._id}
                transaction={tx}
                onInitiateReverse={(targetTx) => {
                  setApiError(null);
                  setSelectedTx(targetTx);
                }}
              />
            ))
          )}
        </tbody>
      </table>

      {selectedTx && (
        <TransactionReverseModal
          transaction={selectedTx}
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          onSuccess={() => {
            setSelectedTx(null);
          }}
        />
      )}
    </div>
  );
}
