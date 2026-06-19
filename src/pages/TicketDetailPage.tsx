import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { UpdateTicketPayload } from "../api/tickets";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Textarea,
} from "../components/ui";
import { AppLayout } from "../components/layout/AppLayout";
import {
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  PRIORITY_VARIANTS,
  STATUS_LABELS,
  STATUS_OPTIONS,
  STATUS_VARIANTS,
} from "../features/tickets/constants";
import { useTicket } from "../hooks/useTicket";
import { useUpdateTicket } from "../hooks/useUpdateTicket";
import { getApiErrorMessage } from "../utils/apiError";
import { formatDate } from "../utils/formatDate";

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ticketId = id ? Number(id) : null;
  const [editMode, setEditMode] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    setEditMode(false);
    setApiError(null);
  }, [ticketId]);

  const { data: ticket, isLoading, isError, error } = useTicket(ticketId);
  const updateTicketMutation = useUpdateTicket();

  const form = useForm<UpdateTicketPayload>({
    defaultValues: {
      title: "",
      description: "",
      status: "OPEN",
      priority: "MEDIUM",
    },
  });

  const startEdit = () => {
    if (!ticket) return;
    setApiError(null);
    form.reset({
      title: ticket.title,
      description: ticket.description ?? "",
      status: ticket.status,
      priority: ticket.priority,
    });
    setEditMode(true);
  };

  const onSubmit = async (payload: UpdateTicketPayload) => {
    if (ticketId == null) return;
    setApiError(null);
    try {
      await updateTicketMutation.mutateAsync({ id: ticketId, payload });
      toast.success("Ticket mis à jour");
      setEditMode(false);
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    }
  };

  return (
    <AppLayout>
      <Link
        to="/"
        className="mb-4 inline-flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Retour à la liste
      </Link>

      <Card className="dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="py-6">
          {isLoading && !ticket && (
            <div className="flex justify-center py-12">
              <span className="size-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </div>
          )}

          {isError && (
            <Alert variant="error" title="Erreur">
              {error instanceof Error
                ? error.message
                : "Impossible de charger le ticket."}
            </Alert>
          )}

          {!isLoading && !isError && !ticket && (
            <p className="py-8 text-center text-gray-500 dark:text-gray-400">
              Ticket introuvable.
            </p>
          )}

          {ticket && !editMode && (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {ticket.title}
                </h1>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant={STATUS_VARIANTS[ticket.status]}>
                    {STATUS_LABELS[ticket.status]}
                  </Badge>
                  <Badge variant={PRIORITY_VARIANTS[ticket.priority]}>
                    {PRIORITY_LABELS[ticket.priority]}
                  </Badge>
                </div>
              </div>

              {ticket.description && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                    {ticket.description}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Créé par
                  </span>{" "}
                  {ticket.createdBy?.email ?? "Utilisateur inconnu"}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Créé le
                  </span>{" "}
                  {formatDate(ticket.createdAt)}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Modifié le
                  </span>{" "}
                  {formatDate(ticket.updatedAt)}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/")}>
                  Fermer
                </Button>
                <Button onClick={startEdit}>Modifier</Button>
              </div>
            </div>
          )}

          {ticket && editMode && (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {apiError && (
                <Alert variant="error" title="Erreur">
                  {apiError}
                </Alert>
              )}
              <Input
                label="Titre"
                error={form.formState.errors.title?.message}
                {...form.register("title", {
                  required: "Le titre est requis",
                  minLength: {
                    value: 5,
                    message: "Le titre doit contenir au moins 5 caractères",
                  },
                })}
              />
              <Textarea
                label="Description (optionnel)"
                rows={4}
                {...form.register("description")}
              />
              <Select
                label="Statut"
                options={STATUS_OPTIONS}
                {...form.register("status", { required: true })}
              />
              <Select
                label="Priorité"
                options={PRIORITY_OPTIONS}
                {...form.register("priority", { required: true })}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditMode(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={updateTicketMutation.isPending}
                >
                  Enregistrer
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
