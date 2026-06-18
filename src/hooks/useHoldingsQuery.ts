"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";

// 1. Fully-Typed Explicit Domain Interfaces
export interface PortfolioOverview {
  netWorth: number;
  totalInvestedAmount: number;
  totalRealizedProfit: number;
  cashBalance: number;
  totalBuyVolume: number;
  totalSellVolume: number;
  totalCommissionPaid: number;
}

export interface Holding {
  _id: string;
  userId: string;
  companyName: string;
  totalQuantity: number;
  avgBuyPrice: number;
  totalInvestedAmount: number;
  realizedProfit: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FilterMetadata {
  status: string;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface ApiResponse {
  success: boolean;
  data: {
    holdings: Holding[];
    overview: PortfolioOverview;
  };
  meta: {
    pagination: PaginationMetadata;
    filters: FilterMetadata;
  };
}

// React state parameter contract
export interface HoldingsQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "SOLD" | "CLOSED" | "ALL" | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | null;
}

// 2. Optimized Fetch Implementation utilizing URLSearchParams
async function fetchHoldings(
  filters: HoldingsQueryFilters,
): Promise<ApiResponse> {
  const queryParams = new URLSearchParams();

  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  if (filters.search) queryParams.append("search", filters.search.trim());
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
  if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

  const url = `/api/holdings?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.message ||
        `Failed to fetch asset holdings data: Status ${response.status}`,
    );
  }

  return response.json();
}

// 3. Dynamic Custom Hook Wrap
export function useHoldingsQuery(filters: HoldingsQueryFilters = {}) {
  const normalizedFilters: HoldingsQueryFilters = {
    page: filters.page || 1,
    limit: filters.limit || 10,
    search: filters.search || "",
    status: filters.status || "ACTIVE",
    sortBy: filters.sortBy || "lastUpdated",
    sortOrder: filters.sortOrder || "desc",
  };

  return useQuery<ApiResponse, Error>({
    queryKey: ["portfolio", "holdings", normalizedFilters],
    queryFn: () => fetchHoldings(normalizedFilters),

    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });
}
