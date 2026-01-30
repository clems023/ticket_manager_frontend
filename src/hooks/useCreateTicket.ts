import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTicket, type CreateTicketPayload } from "../api/tickets";

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTicketPayload) => createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}
