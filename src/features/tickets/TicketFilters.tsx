import type { TicketPriority, TicketStatus } from "../../api/tickets";
import { Input, Select } from "../../components/ui";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "./constants";

export interface TicketFiltersState {
  search: string;
  status: TicketStatus | "";
  priority: TicketPriority | "";
}

interface TicketFiltersProps {
  filters: TicketFiltersState;
  onChange: (filters: TicketFiltersState) => void;
}

const ALL_STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  ...STATUS_OPTIONS,
];

const ALL_PRIORITY_OPTIONS = [
  { value: "", label: "Toutes les priorités" },
  ...PRIORITY_OPTIONS,
];

export function TicketFilters({ filters, onChange }: TicketFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Input
        label="Rechercher"
        placeholder="Titre ou description…"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
      <Select
        label="Statut"
        options={ALL_STATUS_OPTIONS}
        value={filters.status}
        onChange={(e) =>
          onChange({
            ...filters,
            status: e.target.value as TicketStatus | "",
          })
        }
      />
      <Select
        label="Priorité"
        options={ALL_PRIORITY_OPTIONS}
        value={filters.priority}
        onChange={(e) =>
          onChange({
            ...filters,
            priority: e.target.value as TicketPriority | "",
          })
        }
      />
    </div>
  );
}
