"use client";

import { useState, useMemo } from "react";
import type { VehicleRow, FleetFilters, Payment } from "@/types/fleet";
import type { FleetStats } from "@/app/lib/queries";
import { filterVehicles } from "@/app/lib/fleet";
import { StatsRow } from "@/app/components/StatsRow";
import { LoanList } from "@/app/components/LoanList";
import { Sidebar } from "@/app/components/Sidebar";
import { VehicleGrid } from "@/app/components/VehicleGrid";
import { VehicleModal } from "@/app/components/VehicleModal";
import { AlertBanner } from "@/app/components/AlertBanner";
import { NewVehicleDrawer } from "@/app/components/NewVehicleDrawer";
import { ExcelExportBtn } from "./ExcelExportBtn";
import { PaymentAlerts } from "@/app/components/PaymentAlerts";
import { Car, X } from "lucide-react";
type Props = {
  vehicles: VehicleRow[];
  stats: FleetStats;
  empresas: { id: number; nombre: string }[];
  payments: Payment[];
  loans: any[]; // luego lo tipamos mejor
};

const DEFAULT_FILTERS: FleetFilters = {
  empresa: "all",
  tipoUnidad: "all",
  estado: "all",
  propiedad: "all",
  search: "",
};

function isDefaultFilters(f: FleetFilters) {
  return (
    f.empresa === "all" &&
    f.tipoUnidad === "all" &&
    f.estado === "all" &&
    f.propiedad === "all" &&
    f.search === ""
  );
}

export function FleetDashboard({
  vehicles,
  stats,
  empresas,
  payments,
  loans,
}: Props) {
  const [filters, setFilters] = useState<FleetFilters>(DEFAULT_FILTERS);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRow | null>(
    null,
  );
  const [alertsExpanded, setAlertsExpanded] = useState(true);

  const filtered = useMemo(
    () => filterVehicles(vehicles, filters),
    [vehicles, filters],
  );

  const alertVehicles = useMemo(
    () =>
      vehicles.filter((v) =>
        ["VENCIDO", "CRITICO", "POR_VENCER"].includes(v.worstStatus),
      ),
    [vehicles],
  );

  const hasActiveFilters = !isDefaultFilters(filters);

  function setFilter<K extends keyof FleetFilters>(
    key: K,
    value: FleetFilters[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* ── Topbar ── */}
      <header className="sticky top-0 z-20 bg-background border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Car className="w-4 h-4 stroke-blue-600" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-none">
                Flota vehicular
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {vehicles.length} unidades · {empresas.length} empresas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/60 rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
              >
                <X className="w-3 h-3" />
                Limpiar filtros
              </button>
            )}
            <ExcelExportBtn vehicles={filtered} payments={payments} />
            <NewVehicleDrawer empresas={empresas} />
          </div>
        </div>

        {/* Pills de filtros activos */}
        {hasActiveFilters && (
          <div className="max-w-[1400px] mx-auto px-5 pb-2 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-muted-foreground">
              Filtrando por:
            </span>
            {filters.empresa !== "all" && (
              <FilterPill
                label={`Empresa: ${empresas.find((e) => e.id.toString() === filters.empresa)?.nombre ?? filters.empresa}`}
                onRemove={() => setFilter("empresa", "all")}
              />
            )}
            {filters.estado !== "all" && (
              <FilterPill
                label={`Estado: ${filters.estado}`}
                onRemove={() => setFilter("estado", "all")}
              />
            )}
            {filters.tipoUnidad !== "all" && (
              <FilterPill
                label={`Tipo: ${filters.tipoUnidad}`}
                onRemove={() => setFilter("tipoUnidad", "all")}
              />
            )}
            {filters.propiedad !== "all" && (
              <FilterPill
                label={`Propiedad: ${filters.propiedad}`}
                onRemove={() => setFilter("propiedad", "all")}
              />
            )}
            {filters.search && (
              <FilterPill
                label={`Búsqueda: "${filters.search}"`}
                onRemove={() => setFilter("search", "")}
              />
            )}
            <span className="text-[10px] text-muted-foreground ml-1">
              → {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </header>

      {/* ── Alertas de cuotas de préstamos ── */}
      <PaymentAlerts payments={payments} />

      {/* ── Alert banner de documentos ── */}
      {alertVehicles.length > 0 && (
        <AlertBanner
          vehicles={alertVehicles}
          expanded={alertsExpanded}
          onToggle={() => setAlertsExpanded(!alertsExpanded)}
          onVehicleClick={setSelectedVehicle}
        />
      )}

      {/* ── Main layout ── */}
      <div className="flex-1 max-w-[1400px] mx-auto w-full px-5 py-5 flex gap-5">
        <aside className="w-52 shrink-0">
          <Sidebar
            vehicles={vehicles}
            filters={filters}
            empresas={empresas}
            onFilterChange={setFilter}
          />
        </aside>

        <main className="flex-1 min-w-0 flex flex-col gap-4">
          <StatsRow stats={stats} />
          <LoanList loans={loans} /> {/* 👈 AQUÍ */}
          <VehicleGrid
            vehicles={filtered}
            filters={filters}
            onFilterChange={setFilter}
            onVehicleClick={setSelectedVehicle}
          />
        </main>
      </div>

      {/* ── Modal detalle ── */}
      {selectedVehicle && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
}

function FilterPill({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:text-blue-900 transition-colors"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}
