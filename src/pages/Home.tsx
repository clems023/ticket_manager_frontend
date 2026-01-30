import { useState } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Badge,
  Alert,
  Modal,
  Input,
  Textarea,
  Select,
} from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { useTickets } from "../hooks/useTickets";
import { useTicket } from "../hooks/useTicket";
import { useCreateTicket } from "../hooks/useCreateTicket";
import { useUpdateTicket } from "../hooks/useUpdateTicket";
import type {
  TicketStatus,
  TicketPriority,
  CreateTicketPayload,
  UpdateTicketPayload,
} from "../api/tickets";

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: "OPEN", label: "Ouvert" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "DONE", label: "Terminé" },
];

const PRIORITY_OPTIONS: { value: TicketPriority; label: string }[] = [
  { value: "LOW", label: "Basse" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "HIGH", label: "Haute" },
];

function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data && typeof data === "object") {
      if (typeof data.message === "string") return data.message;
      if (Array.isArray(data.message)) return data.message.join(", ");
      if (typeof data.error === "string") return data.error;
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Une erreur est survenue. Réessayez.";
}

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Ouvert",
  IN_PROGRESS: "En cours",
  DONE: "Terminé",
};

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
};

const STATUS_VARIANTS: Record<TicketStatus, "default" | "warning" | "success"> =
  {
    OPEN: "default",
    IN_PROGRESS: "warning",
    DONE: "success",
  };

const PRIORITY_VARIANTS: Record<
  TicketPriority,
  "default" | "warning" | "danger"
> = {
  LOW: "default",
  MEDIUM: "warning",
  HIGH: "danger",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TicketCard({
  ticket,
  onSelect,
}: {
  ticket: {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: string;
    createdBy: { email: string };
  };
  onSelect?: (id: number) => void;
}) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onSelect?.(ticket.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(ticket.id);
        }
      }}
    >
      <CardContent className="py-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={STATUS_VARIANTS[ticket.status]}>
              {STATUS_LABELS[ticket.status]}
            </Badge>
            <Badge variant={PRIORITY_VARIANTS[ticket.priority]}>
              {PRIORITY_LABELS[ticket.priority]}
            </Badge>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {ticket.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>Par {ticket.createdBy.email}</span>
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function Home() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [detailEditMode, setDetailEditMode] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useTickets({
    page,
    sort: "createdAt",
    order: "desc",
    limit: 20,
  });

  const createTicketMutation = useCreateTicket();
  const updateTicketMutation = useUpdateTicket();
  const {
    data: selectedTicket,
    isLoading: selectedLoading,
    isError: selectedError,
    error: selectedErrorData,
  } = useTicket(selectedTicketId);
  const createForm = useForm<CreateTicketPayload>({
    defaultValues: {
      title: "",
      description: "",
      status: "OPEN",
      priority: "MEDIUM",
    },
  });

  const onOpenCreateModal = () => {
    setCreateError(null);
    createForm.reset({
      title: "",
      description: "",
      status: "OPEN",
      priority: "MEDIUM",
    });
    setCreateModalOpen(true);
  };

  const onCloseCreateModal = () => {
    setCreateModalOpen(false);
    setCreateError(null);
  };

  const onCreateSubmit = async (payload: CreateTicketPayload) => {
    setCreateError(null);
    try {
      await createTicketMutation.mutateAsync(payload);
      onCloseCreateModal();
    } catch (err) {
      setCreateError(getApiErrorMessage(err));
    }
  };

  const editForm = useForm<UpdateTicketPayload>({
    defaultValues: {
      title: "",
      description: "",
      status: "OPEN",
      priority: "MEDIUM",
    },
  });

  const onOpenDetailEdit = () => {
    if (!selectedTicket) return;
    setDetailError(null);
    editForm.reset({
      title: selectedTicket.title,
      description: selectedTicket.description ?? "",
      status: selectedTicket.status,
      priority: selectedTicket.priority,
    });
    setDetailEditMode(true);
  };

  const onCloseDetailEdit = () => {
    setDetailEditMode(false);
    setDetailError(null);
  };

  const onDetailModalClose = () => {
    setSelectedTicketId(null);
    setDetailEditMode(false);
    setDetailError(null);
  };

  const onEditSubmit = async (payload: UpdateTicketPayload) => {
    if (selectedTicketId == null) return;
    setDetailError(null);
    try {
      await updateTicketMutation.mutateAsync({
        id: selectedTicketId,
        payload,
      });
      setDetailEditMode(false);
    } catch (err) {
      setDetailError(getApiErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-semibold text-gray-900">
            Ticket Manager
          </h1>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600">{user.email}</span>
            )}
            <Button variant="ghost" size="sm" onClick={logout}>
              Se déconnecter
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card className="mb-6">
          <CardHeader
            title="Liste des tickets"
            subtitle={
              data?.meta
                ? `${data.meta.total} ticket(s) — Page ${data.meta.page} sur ${data.meta.totalPages}`
                : "Chargement…"
            }
            action={
              <Button size="sm" onClick={onOpenCreateModal}>
                Créer un ticket
              </Button>
            }
          />
          <CardContent>
            {isLoading && (
              <div className="flex justify-center py-12">
                <span className="size-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </div>
            )}

            {isError && (
              <Alert variant="error" title="Erreur">
                {error instanceof Error
                  ? error.message
                  : "Impossible de charger les tickets."}
              </Alert>
            )}

            {data && !isLoading && !isError && (
              <>
                <ul className="space-y-3">
                  {data.data.map((ticket) => (
                    <li key={ticket.id}>
                      <TicketCard
                        ticket={ticket}
                        onSelect={(id) => setSelectedTicketId(id)}
                      />
                    </li>
                  ))}
                </ul>

                {data.meta.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Précédent
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {data.meta.page} sur {data.meta.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= data.meta.totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(data.meta.totalPages, p + 1))
                      }
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </>
            )}

            {data?.data.length === 0 && !isLoading && (
              <p className="py-8 text-center text-gray-500">
                Aucun ticket pour le moment.
              </p>
            )}
          </CardContent>
        </Card>

        <Modal
          open={createModalOpen}
          onClose={onCloseCreateModal}
          title="Créer un ticket"
        >
          <form
            onSubmit={createForm.handleSubmit(onCreateSubmit)}
            className="space-y-4"
          >
            {createError && (
              <Alert variant="error" title="Erreur">
                {createError}
              </Alert>
            )}
            <Input
              label="Titre"
              placeholder="Titre du ticket"
              error={createForm.formState.errors.title?.message}
              {...createForm.register("title", {
                required: "Le titre est requis",
              })}
            />
            <Textarea
              label="Description (optionnel)"
              placeholder="Description du ticket"
              rows={3}
              {...createForm.register("description")}
            />
            <Select
              label="Statut"
              options={STATUS_OPTIONS}
              error={createForm.formState.errors.status?.message}
              {...createForm.register("status", {
                required: "Le statut est requis",
              })}
            />
            <Select
              label="Priorité"
              options={PRIORITY_OPTIONS}
              error={createForm.formState.errors.priority?.message}
              {...createForm.register("priority", {
                required: "La priorité est requise",
              })}
            />
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCloseCreateModal}
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

        <Modal
          open={selectedTicketId != null}
          onClose={onDetailModalClose}
          title={detailEditMode ? "Modifier le ticket" : "Détail du ticket"}
        >
          {selectedLoading && (
            <div className="flex justify-center py-12">
              <span className="size-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </div>
          )}
          {selectedError && (
            <Alert variant="error" title="Erreur">
              {selectedErrorData instanceof Error
                ? selectedErrorData.message
                : "Impossible de charger le ticket."}
            </Alert>
          )}
          {selectedTicket && !selectedLoading && !detailEditMode && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTicket.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant={STATUS_VARIANTS[selectedTicket.status]}>
                    {STATUS_LABELS[selectedTicket.status]}
                  </Badge>
                  <Badge variant={PRIORITY_VARIANTS[selectedTicket.priority]}>
                    {PRIORITY_LABELS[selectedTicket.priority]}
                  </Badge>
                </div>
              </div>
              {selectedTicket.description && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Description
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                    {selectedTicket.description}
                  </p>
                </div>
              )}
              <div className="border-t border-gray-100 pt-4 text-sm text-gray-500">
                <p>
                  <span className="font-medium text-gray-700">Créé par</span>{" "}
                  {selectedTicket.createdBy.email}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-gray-700">Créé le</span>{" "}
                  {formatDate(selectedTicket.createdAt)}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-gray-700">Modifié le</span>{" "}
                  {formatDate(selectedTicket.updatedAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onDetailModalClose}
                >
                  Fermer
                </Button>
                <Button className="flex-1" onClick={onOpenDetailEdit}>
                  Modifier
                </Button>
              </div>
            </div>
          )}
          {selectedTicket && !selectedLoading && detailEditMode && (
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-4"
            >
              {detailError && (
                <Alert variant="error" title="Erreur">
                  {detailError}
                </Alert>
              )}
              <Input
                label="Titre"
                placeholder="Titre du ticket"
                error={editForm.formState.errors.title?.message}
                {...editForm.register("title", {
                  required: "Le titre est requis",
                  minLength: {
                    value: 5,
                    message: "Le titre doit contenir au moins 5 caractères",
                  },
                })}
              />
              <Textarea
                label="Description (optionnel)"
                placeholder="Description du ticket"
                rows={3}
                {...editForm.register("description")}
              />
              <Select
                label="Statut"
                options={STATUS_OPTIONS}
                error={editForm.formState.errors.status?.message}
                {...editForm.register("status", {
                  required: "Le statut est requis",
                })}
              />
              <Select
                label="Priorité"
                options={PRIORITY_OPTIONS}
                error={editForm.formState.errors.priority?.message}
                {...editForm.register("priority", {
                  required: "La priorité est requise",
                })}
              />
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onCloseDetailEdit}
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
        </Modal>
      </main>
    </div>
  );
}
