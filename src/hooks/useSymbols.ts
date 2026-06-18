import { useQuery } from "@tanstack/react-query";

const fetchSymbols = async (): Promise<string[]> => {
  const res = await fetch("/api/holdings/symbols");

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch symbols");
  }

  const json = await res.json();
  return json.data;
};

export const useSymbols = () => {
  return useQuery({
    queryKey: ["holdings-symbols"],
    queryFn: fetchSymbols,
    staleTime: 1000 * 60 * 60,
  });
};
