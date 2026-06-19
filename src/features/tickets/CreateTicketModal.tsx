import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { CreateTicketPayload } from "../../api/tickets";
import { Button, Input, Modal, Select, Textarea, Alert } from "../../components/ui";
import { useCreateTicket } from "../../hooks/useCreateTicket";
import { getApiErrorMessage } from "../../utils/apiError";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "./constants";
import { useState } from "react";

interface CreateTicketModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTicketModal({ open, onClose }: CreateTicketModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const createTicketMutation = useCreateTicket();

  const form = useForm<CreateTicketPayload>({
    defaultValues: {
      title: "",
      description: "",
      status: "OPEN",
      priority: "MEDIUM",
    },
  });

  const handleClose = () => {
    setApiError(null);
    form.reset();
    onClose();
  };

  const onSubmit = async (payload: CreateTicketPayload) => {
    setApiError(null);
    try {
      await createTicketMutation.mutateAsync(payload);
      toast.success("Ticket créé avec succès");
      handleClose();
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Créer un ticket">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {apiError && (
          <Alert variant="error" title="Erreur">
            {apiError}
          </Alert>
        )}
        <Input
          label="Titre"
          placeholder="Titre du ticket"
          error={form.formState.errors.title?.message}
          {...form.register("title", { required: "Le titre est requis" })}
        />
        <Textarea
          label="Description (optionnel)"
          placeholder="Description du ticket"
          rows={3}
          {...form.register("description")}
        />
        <Select
          label="Statut"
          options={STATUS_OPTIONS}
          error={form.formState.errors.status?.message}
          {...form.register("status", { required: "Le statut est requis" })}
        />
        <Select
          label="Priorité"
          options={PRIORITY_OPTIONS}
          error={form.formState.errors.priority?.message}
          {...form.register("priority", { required: "La priorité est requise" })}
        />
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleClose}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
            isLoading={createTicketMutation.isPending}
          >
            Créer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
