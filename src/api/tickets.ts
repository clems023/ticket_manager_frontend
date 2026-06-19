import { apiClient } from "./client";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "DONE";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

export interface TicketCreatedBy {
  id: number;
  email: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  createdBy?: TicketCreatedBy;
}

export interface TicketsParams {
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
}

export interface TicketsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TicketsResponse {
  data: Ticket[];
  meta: TicketsMeta;
}

export interface CreateTicketPayload {
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
}

export interface UpdateTicketPayload {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
}

export async function fetchTickets(
  params: TicketsParams = {},
): Promise<TicketsResponse> {
  const {
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 20,
    status,
    priority,
    search,
  } = params;
  const { data } = await apiClient.get<TicketsResponse>("api/tickets", {
    params: {
      sort,
      order,
      page,
      limit,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && { search }),
    },
  });
  return data;
}

export async function createTicket(
  payload: CreateTicketPayload,
): Promise<Ticket> {
  const { data } = await apiClient.post<unknown>("api/tickets", payload);
  return normalizeTicket(data);
}

export async function fetchTicket(id: number): Promise<Ticket> {
  const { data } = await apiClient.get<unknown>(`api/tickets/${id}`);
  return normalizeTicket(data);
}

function normalizeTicket(data: unknown): Ticket {
  if (!data || typeof data !== "object") {
    throw new Error("Réponse ticket invalide");
  }

  const record = data as Record<string, unknown>;

  // Réponse encapsulée : { data: { id, title, ... } }
  if (
    record.data &&
    typeof record.data === "object" &&
    "id" in (record.data as object)
  ) {
    return record.data as Ticket;
  }

  // Réponse directe : { id, title, ... }
  if ("id" in record && "title" in record) {
    return record as Ticket;
  }

  throw new Error("Format de ticket non reconnu");
}

export async function updateTicket(
  id: number,
  payload: UpdateTicketPayload,
): Promise<Ticket> {
  const { data } = await apiClient.patch<unknown>(`api/tickets/${id}`, payload);
  return normalizeTicket(data);
}
