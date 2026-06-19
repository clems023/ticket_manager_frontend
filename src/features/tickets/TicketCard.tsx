import type { Ticket } from "../../api/tickets";
import { Badge, Card, CardContent } from "../../components/ui";
import { formatDate } from "../../utils/formatDate";
import {
  PRIORITY_LABELS,
  PRIORITY_VARIANTS,
  STATUS_LABELS,
  STATUS_VARIANTS,
} from "./constants";

interface TicketCardProps {
  ticket: Ticket;
  onSelect?: (id: number) => void;
}

export function TicketCard({ ticket, onSelect }: TicketCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
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
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {ticket.title}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={STATUS_VARIANTS[ticket.status]}>
              {STATUS_LABELS[ticket.status]}
            </Badge>
            <Badge variant={PRIORITY_VARIANTS[ticket.priority]}>
              {PRIORITY_LABELS[ticket.priority]}
            </Badge>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {ticket.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          <span>Par {ticket.createdBy?.email ?? "—"}</span>
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
