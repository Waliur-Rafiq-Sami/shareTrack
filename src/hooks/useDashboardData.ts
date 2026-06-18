import { useQuery } from "@tanstack/react-query";
import { ApiResponse, IDashboardPayload } from "@/app/api/summary/route";

export const fetchDashboardData = async (): Promise<
  ApiResponse<IDashboardPayload>
> => {
  const res = await fetch("/api/summary", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return res.json();
};

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: fetchDashboardData,
    refetchInterval: 60000,
    staleTime: 30000,
  });
}
