// hooks/useReverseTransaction.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ReversePayload {
  transactionId: string;
}

interface ReverseResponse {
  success: boolean;
  message: string;
}

const executeReverse = async (
  payload: ReversePayload,
): Promise<ReverseResponse> => {
  const res = await fetch("/api/trade/reverse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to reverse transaction.");
  }

  return res.json();
};

export function useReverseTransaction() {
  const queryClient = useQueryClient();

  return useMutation<ReverseResponse, Error, ReversePayload>({
    mutationFn: executeReverse,
    onSuccess: () => {
      // THE MAGIC: Invalidate everything so the UI instantly updates
      // This forces TanStack Query to refetch the fresh data from the server.

      // 1. Update the top-level metrics (net worth, cash balance, etc.)
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });

      // 2. Update the master ledger table
      queryClient.invalidateQueries({ queryKey: ["transactionsLedger"] });

      // 3. Update the holdings table (in case shares were returned/removed)
      queryClient.invalidateQueries({ queryKey: ["portfolio", "holdings"] });

      // 4. Update the specific company's share records
      queryClient.invalidateQueries({ queryKey: ["shareRecords"] });

      // 5. Update the dropdown symbols (in case reversing a sell brought a company back to active)
      queryClient.invalidateQueries({ queryKey: ["holdings-symbols"] });
    },
    onError: (error) => {
      // You can handle toasts/notifications here, or let the component handle it via `onError` callback
      console.error("Reverse Transaction Error:", error.message);
    },
  });
}
