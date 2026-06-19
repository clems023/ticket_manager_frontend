import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicket, type UpdateTicketPayload } from "../api/tickets";

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateTicketPayload;
    }) => updateTicket(id, payload),
    onSuccess: (updatedTicket, variables) => {
      queryClient.setQueryData(["ticket", variables.id], updatedTicket);
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}
