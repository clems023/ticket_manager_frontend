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
  createdBy: TicketCreatedBy;
}

export interface TicketsParams {
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
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
  const { sort = "createdAt", order = "desc", page = 1, limit = 20 } = params;
  const { data } = await apiClient.get<TicketsResponse>("api/tickets", {
    params: { sort, order, page, limit },
  });
  return data;
}

export async function createTicket(
  payload: CreateTicketPayload,
): Promise<Ticket> {
  const { data } = await apiClient.post<Ticket>("api/tickets", payload);
  return data;
}

export async function fetchTicket(id: number): Promise<Ticket> {
  const { data } = await apiClient.get<Ticket>(`api/tickets/${id}`);
  return data;
}

export async function updateTicket(
  id: number,
  payload: UpdateTicketPayload,
): Promise<Ticket> {
  const { data } = await apiClient.patch<Ticket>(`api/tickets/${id}`, payload);
  return data;
}
