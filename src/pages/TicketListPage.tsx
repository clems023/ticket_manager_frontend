import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, CardContent, CardHeader } from "../components/ui";
import { AppLayout } from "../components/layout/AppLayout";
import { CreateTicketModal } from "../features/tickets/CreateTicketModal";
import { TicketCard } from "../features/tickets/TicketCard";
import {
  TicketFilters,
  type TicketFiltersState,
} from "../features/tickets/TicketFilters";
import { TicketListSkeleton } from "../features/tickets/TicketListSkeleton";
import { useTickets } from "../hooks/useTickets";

const EMPTY_FILTERS: TicketFiltersState = {
  search: "",
  status: "",
  priority: "",
};

export function TicketListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TicketFiltersState>(EMPTY_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const handleFiltersChange = (newFilters: TicketFiltersState) => {
    const statusOrPriorityChanged =
      newFilters.status !== filters.status ||
      newFilters.priority !== filters.priority;
    setFilters(newFilters);
    if (statusOrPriorityChanged) {
      setPage(1);
    }
  };

  const { data, isLoading, isError, error } = useTickets({
    page,
    sort: "createdAt",
    order: "desc",
    limit: 20,
    ...(filters.status && { status: filters.status }),
    ...(filters.priority && { priority: filters.priority }),
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const tickets = data?.data ?? [];
  const displayedTickets = debouncedSearch
    ? tickets.filter((ticket) => {
        const q = debouncedSearch.toLowerCase();
        return (
          ticket.title.toLowerCase().includes(q) ||
          ticket.description.toLowerCase().includes(q)
        );
      })
    : tickets;

  return (
    <AppLayout>
      <Card className="dark:border-gray-700 dark:bg-gray-800">
        <CardHeader
          title="Liste des tickets"
          subtitle={
            data?.meta
              ? `${data.meta.total} ticket(s) — Page ${data.meta.page} sur ${data.meta.totalPages}`
              : "Chargement…"
          }
          action={
            <Button size="sm" onClick={() => setCreateModalOpen(true)}>
              Créer un ticket
            </Button>
          }
        />
        <CardContent className="space-y-6">
          <TicketFilters filters={filters} onChange={handleFiltersChange} />

          {isLoading && <TicketListSkeleton />}

          {isError && (
            <Alert variant="error" title="Erreur">
              {error instanceof Error
                ? error.message
                : "Impossible de charger les tickets."}
            </Alert>
          )}

          {data && !isLoading && !isError && (
            <>
              {displayedTickets.length > 0 ? (
                <ul className="space-y-3">
                  {displayedTickets.map((ticket) => (
                    <li key={ticket.id}>
                      <TicketCard
                        ticket={ticket}
                        onSelect={(id) => navigate(`/tickets/${id}`)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Aucun ticket ne correspond à vos critères.
                  </p>
                  <Button
                    className="mt-4"
                    size="sm"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    Créer un ticket
                  </Button>
                </div>
              )}

              {data.meta.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Précédent
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
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
        </CardContent>
      </Card>

      <CreateTicketModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </AppLayout>
  );
}
