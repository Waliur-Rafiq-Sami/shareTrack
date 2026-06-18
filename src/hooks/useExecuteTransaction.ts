import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface TransactionPayload {
  actionType: "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";
  companyName?: string;
  quantity?: number;
  rate?: number;
  commissionType?: "PERCENTAGE" | "FIXED";
  commissionValue?: number;
  amount?: number;
  forceBuy?: boolean;
}

interface TransactionResponse {
  success: boolean;
  message: string;
  netCashImpact: number;
  currentBalance: number;
}

const executeAction = async (
  payload: TransactionPayload,
): Promise<TransactionResponse> => {
  const endpoint = ["BUY", "SELL"].includes(payload.actionType)
    ? "/api/trade/execute"
    : "/api/wallet/transaction";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.message || `${payload.actionType} execution failed`,
    );
  }

  return res.json();
};

export function useExecuteTransaction() {
  const queryClient = useQueryClient();

  return useMutation<TransactionResponse, Error, TransactionPayload>({
    mutationFn: executeAction,

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      queryClient.invalidateQueries({ queryKey: ["transactionsLedger"] });

      if (variables.actionType === "BUY" || variables.actionType === "SELL") {
        queryClient.invalidateQueries({ queryKey: ["portfolio", "holdings"] });

        queryClient.invalidateQueries({ queryKey: ["shareRecords"] });

        if (variables.actionType === "BUY") {
          queryClient.invalidateQueries({ queryKey: ["holdings-symbols"] });
        }
      }
    },

    onError: (error) => {
      console.error("Transaction Error:", error.message);
    },
  });
}
