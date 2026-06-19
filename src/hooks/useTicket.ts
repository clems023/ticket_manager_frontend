import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTicket, type TicketsResponse } from "../api/tickets";

export function useTicket(id: number | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => fetchTicket(id!),
    enabled: id != null && !Number.isNaN(id),
    initialData: () => {
      if (id == null) return undefined;

      const listQueries = queryClient.getQueriesData<TicketsResponse>({
        queryKey: ["tickets"],
      });

      for (const [, response] of listQueries) {
        const found = response?.data?.find((ticket) => ticket.id === id);
        if (found) return found;
      }

      return undefined;
    },
  });
}
