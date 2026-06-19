import type { TicketPriority, TicketStatus } from "../../api/tickets";

export const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: "OPEN", label: "Ouvert" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "DONE", label: "Terminé" },
];

export const PRIORITY_OPTIONS: { value: TicketPriority; label: string }[] = [
  { value: "LOW", label: "Basse" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "HIGH", label: "Haute" },
];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Ouvert",
  IN_PROGRESS: "En cours",
  DONE: "Terminé",
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
};

export const STATUS_VARIANTS: Record<
  TicketStatus,
  "default" | "warning" | "success"
> = {
  OPEN: "default",
  IN_PROGRESS: "warning",
  DONE: "success",
};

export const PRIORITY_VARIANTS: Record<
  TicketPriority,
  "default" | "warning" | "danger"
> = {
  LOW: "default",
  MEDIUM: "warning",
  HIGH: "danger",
};
