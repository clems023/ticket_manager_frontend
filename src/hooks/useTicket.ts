import { useQuery } from "@tanstack/react-query";
import { fetchTicket } from "../api/tickets";

export function useTicket(id: number | null) {
  return useQuery({
    queryKey: ["tickets", id],
    queryFn: () => fetchTicket(id!),
    enabled: id != null,
  });
}
