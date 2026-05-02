"use client";

import { useState, useMemo } from "react";
import type { VehicleRow, FleetFilters } from "@/types/fleet";
import type { FleetStats } from "@/app/lib/queries";
import { filterVehicles } from "@/app/lib/fleet";
import { StatsRow } from "@/app/components/StatsRow";
import { Sidebar } from "@/app/components/Sidebar";
import { VehicleGrid } from "@/app/components/VehicleGrid";
import { VehicleModal } from "@/app/components/VehicleModal";
import { AlertBanner } from "@/app/components/AlertBanner";
import { NewVehicleDrawer } from "@/app/components/NewVehicleDrawer";
import { Car } from "lucide-react";

type Props = {
  vehicles: VehicleRow[];
  stats: FleetStats;
  empresas: { id: number; nombre: string }[];
};

const DEFAULT_FILTERS: FleetFilters = {
  empresa: "all",
  tipoUnidad: "all",
  estado: "all",
  propiedad: "all",
  search: "",
};

export function FleetDashboard({ vehicles, stats, empresas }: Props) {
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

  function setFilter<K extends keyof FleetFilters>(
    key: K,
    value: FleetFilters[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
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
          <NewVehicleDrawer empresas={empresas} />
        </div>
      </header>

      {/* ── Alert banner ── */}
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
