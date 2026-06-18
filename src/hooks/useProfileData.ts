"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useProfileData(enabled: boolean = true) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user-profile-context"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled,
    // Enterprise standard: cache the data for 5 minutes to prevent redundant API calls
    staleTime: 5 * 60 * 1000,
  });

  // Expose a method to manually update the React Query cache instantly
  const setLocalProfileData = (updatedFields: Record<string, any>) => {
    queryClient.setQueryData(["user-profile-context"], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: { ...oldData.data, ...updatedFields },
      };
    });
  };

  return {
    ...query,
    profile: query.data?.data,
    isSuccess: query.data?.success,
    setLocalProfileData,
  };
}
