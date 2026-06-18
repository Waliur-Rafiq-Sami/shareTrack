import { useQuery, keepPreviousData } from "@tanstack/react-query";

export interface TransactionFilters {
  page?: number;
  limit?: number;
  search?: string;
  companyName?: string;
  actionType?: "ALL" | "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";
  status?: "ALL" | "COMPLETE" | "COMPLETED" | "PENDING" | "CANCELLED";
  isReversed?: boolean;
  startDate?: string;
  endDate?: string;
  minRate?: number;
  maxRate?: number;
  minQuantity?: number;
  maxQuantity?: number;
  minGrossAmount?: number;
  maxGrossAmount?: number;
  minCommission?: number;
  maxCommission?: number;
  minNetImpact?: number;
  maxNetImpact?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TransactionRecord {
  _id: string;
  userId: string;
  actionType: "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";
  companyName?: string;
  quantity?: number;
  rate?: number;
  grossAmount: number;
  commissionAmount: number;
  netCashImpact: number;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
  isReversed: boolean;
  transactionDate: string;
  createdAt: string;
}

interface PaginatedResponse {
  success: boolean;
  data: TransactionRecord[];
  meta: {
    pagination: {
      totalItems: number;
      page: number;
      limit: number;
      currentPage: number;
      itemsPerPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    appliedFilters: Record<string, any>;
  };
}

const fetchTransactions = async (
  filters: TransactionFilters,
): Promise<PaginatedResponse> => {
  // Construct URL safe entries by purging empty bindings cleanly
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

  const params = new URLSearchParams(cleanFilters as Record<string, string>);
  const response = await fetch(`/api/transactions?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch transactions ledger");
  }

  return response.json();
};

export function useTransactionsLedger(filters: TransactionFilters) {
  return useQuery({
    // Fully deep serialize hook tracking array keys
    queryKey: ["transactionsLedger", filters],
    queryFn: () => fetchTransactions(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30, // 30-second safe cache state balance
    retry: 1,
  });
}
