import { useQuery } from "@tanstack/react-query";
import { readHealthData, isHealthAvailable, HealthData } from "../../lib/health/healthConnect";

export function useHealthData(date: Date) {
  return useQuery({
    queryKey: ["health", date.toISOString().split("T")[0]],
    queryFn: async (): Promise<HealthData> => {
      return readHealthData(date);
    },
    enabled: isHealthAvailable(),
    staleTime: 1000 * 60 * 15, // 15 min
  });
}
