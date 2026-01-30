import { useQuery } from "@tanstack/react-query";
import { fetchTickets, type TicketsParams } from "../api/tickets";

export function useTickets(params: TicketsParams = {}) {
  const { page = 1, sort = "createdAt", order = "desc", limit = 20 } = params;

  return useQuery({
    queryKey: ["tickets", { page, sort, order, limit }],
    queryFn: () => fetchTickets({ page, sort, order, limit }),
  });
}
